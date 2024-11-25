"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { Canvas, Image, IText } from "fabric";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { Separator } from "./ui/separator";
import { reducerText, TextState, TextAction } from "@/hooks/use-text";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { Label } from "./ui/label";

const CANVAS_MAX_WIDTH = 500;
const CANVAS_MAX_HEIGHT = 600;

const Playground = ({ imageUploaded }: { imageUploaded: File | null }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialState: TextState = { value: "", style: { bold: false, italic: false, underline: false } };
  const [textState, textDispatch] = useReducer<(state: TextState, action: TextAction) => TextState>(reducerText, initialState);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('');
  const [fillColor, setFillColor] = useState<string>('#ffffff');
  const imageRef = useRef<Image | null>(null);

  enum DefaultAspectRatio {
    landscape = "16/9",
    portrait = "9/16",
    square = "1/1",
    squarePost = "4/5",
    vertical = "2/3",
    fullVertical = "3/4",
  }

  const aspectRatios = [
    { label: "16:9", value: DefaultAspectRatio.landscape },
    { label: "9:16", value: DefaultAspectRatio.portrait },
    { label: "1:1", value: DefaultAspectRatio.square },
    { label: "4:5", value: DefaultAspectRatio.squarePost },
    { label: "2:3", value: DefaultAspectRatio.vertical },
    { label: "3:4", value: DefaultAspectRatio.fullVertical }
  ];

  const calculateCanvasDimensions = (ratio: string) => {
    const [width, height] = ratio.split('/').map(num => parseFloat(num));
    const aspectRatio = width / height;

    let canvasWidth: number;
    let canvasHeight: number;

    if (aspectRatio > 1) {
      // Landscape
      canvasWidth = CANVAS_MAX_WIDTH;
      canvasHeight = CANVAS_MAX_WIDTH / aspectRatio;
    } else {
      // Portrait or Square
      canvasHeight = CANVAS_MAX_HEIGHT;
      canvasWidth = CANVAS_MAX_HEIGHT * aspectRatio;
    }

    return { width: canvasWidth, height: canvasHeight };
  };

  const resizeCanvas = (dimensions: { width: number; height: number }) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const currentImage = imageRef.current;

    canvas.setWidth(dimensions.width);
    canvas.setHeight(dimensions.height);
    canvas.backgroundColor = fillColor;

    if (currentImage) {
      // Center image without changing its dimensions
      currentImage.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: 'center',
        originY: 'center'
      });

      // Ensure image maintains its original scale
      if (currentImage._originalScaleX) {
        currentImage.set({
          scaleX: currentImage._originalScaleX,
          scaleY: currentImage._originalScaleY
        });
      }
    }

    canvas.renderAll();
  };

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new Canvas(canvasRef.current, {
        width: CANVAS_MAX_WIDTH,
        height: CANVAS_MAX_HEIGHT,
        backgroundColor: '#ffffff'
      });
      setFillColor('#ffffff');
    }

    return () => {
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (aspectRatio && fabricCanvasRef.current) {
      const dimensions = calculateCanvasDimensions(aspectRatio);
      resizeCanvas(dimensions);
    }
  }, [aspectRatio]);

  useEffect(() => {
    if (fabricCanvasRef.current && imageUploaded) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = fillColor;

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        Image.fromURL(result)
          .then((img) => {
            const canvas = fabricCanvasRef.current!;

            // Store original dimensions
            const originalWidth = img.width!;
            const originalHeight = img.height!;

            // Calculate initial scale to fit the canvas while maintaining aspect ratio
            const scaleX = canvas.getWidth() / originalWidth;
            const scaleY = canvas.getHeight() / originalHeight;
            const scale = Math.min(scaleX, scaleY);

            img.set({
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              selectable: true,
              hasControls: true,
              hasBorders: true,
              hasRotatingPoint: true
            });

            // Store original scale for future reference
            img._originalScaleX = scale;
            img._originalScaleY = scale;

            imageRef.current = img;
            canvas.add(img);
            canvas.renderAll();
          })
          .catch((error) => {
            console.error("Error al cargar la imagen", error);
          });
      };

      reader.readAsDataURL(imageUploaded);
    }
  }, [imageUploaded]);

  const addTextIntoCanvas = () => {
    if (fabricCanvasRef.current) {
      const textObject = new IText(textState?.value || "", {
        left: fabricCanvasRef.current.getWidth() / 2,
        top: fabricCanvasRef.current.getHeight() / 2,
        originX: "center",
        originY: "center",
        fontSize: 24,
        fill: "black",
        fontWeight: textState.style?.bold ? "bold" : "normal",
        fontStyle: textState.style?.italic ? "italic" : "normal",
        underline: textState.style?.underline,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true
      });

      fabricCanvasRef.current.add(textObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  const formatValueFontStyle = (style: string[]) => {
    return style.reduce((acc: { [key: string]: boolean }, value) => {
      acc[value] = true;
      return acc;
    }, {});
  };

  return (
    <section className="w-full flex gap-2 justify-between">
      <section className="w-[30%]">
        <ul className="flex flex-col gap-3">
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-md">
                  Añadir texto
                </CardTitle>
                <CardDescription>
                  Escribe el texto que quieres añadir a la imagen.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Escribe el texto"
                    onChange={(e) => textDispatch({
                      type: "SET_TEXT",
                      payload: {
                        value: e.target.value,
                        style: textState.style
                      }
                    })}
                    value={textState.value}
                  />
                  <Button onClick={addTextIntoCanvas}>
                    Añadir
                  </Button>
                </div>

                <div className="flex">
                  <ToggleGroup
                    type="multiple"
                    onValueChange={(value) => textDispatch({
                      type: "SET_STYLE",
                      payload: {
                        value: textState.value,
                        style: formatValueFontStyle(value)
                      }
                    })}
                  >
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <Italic className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                      <Underline className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <Separator className="my-2" />

                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-sm">Preview</h3>
                  <span
                    id="text-preview"
                    style={{
                      fontFamily: "New Times Roman",
                      fontWeight: textState.style?.bold ? "bold" : "normal",
                      fontStyle: textState.style?.italic ? "italic" : "normal",
                      textDecoration: textState.style?.underline ? "underline" : "none"
                    }}
                  >
                    {textState.value || "Lorem, ipsum dolor sit amet consectetur adipisicing elit."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-md">
                  Relación de aspecto
                </CardTitle>
                <CardDescription>
                  Selecciona la relación de aspecto para el canvas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Select onValueChange={(value) => setAspectRatio(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una relación de aspecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {aspectRatios.map((item) => (
                        <SelectItem
                          className="w-full bg-white"
                          key={item.label}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Separator className="my-2" />

                <div className="flex flex-col gap-2">
                  <Label>
                    Color de fondo
                  </Label>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => {
                      setFillColor(e.target.value);
                      if (fabricCanvasRef.current) {
                        fabricCanvasRef.current.backgroundColor = e.target.value;
                        fabricCanvasRef.current.renderAll();
                      }
                    }}
                    className="w-full h-8"
                  />
                </div>
              </CardContent>
            </Card>
          </li>
        </ul>
      </section>

      <section className="w-[60%] flex justify-center">
        <div className="flex flex-col gap-3">
          <div className="w-[500px] h-[600px] border-[3px] border-dotted flex items-center justify-center">
            <canvas ref={canvasRef} id="canvas" />
          </div>
          <div>
            <Button
              onClick={() => {
                const canvas = fabricCanvasRef.current;
                if (canvas) {
                  const dataURL = canvas.toDataURL({
                    format: "png",
                    quality: 1
                  });
                  const link = document.createElement("a");
                  link.href = dataURL;
                  link.download = "image.png";
                  link.click();
                }
              }}
            >
              Descargar imagen
            </Button>
          </div>

        </div>
      </section>
    </section>
  );
};

export { Playground };