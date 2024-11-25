"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { Canvas, Image, IText, Rect } from "fabric";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { Separator } from "./ui/separator";
import { reducerText, TextState, TextAction } from "@/hooks/use-text";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { Label } from "./ui/label";

const Playground = ({ imageUploaded }: { imageUploaded: File | null }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialState: TextState = { value: "", style: { bold: false, italic: false, underline: false } };
  const [textState, textDispatch] = useReducer<(state: TextState, action: TextAction) => TextState>(reducerText, initialState);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('');
  const [fillColor, setFillColor] = useState<string>('#ffffff');
  const backgroundRectRef = useRef<Rect | null>(null);

  // Tamaño máximo del contenedor
  const maxContainerWidth = 500;
  const maxContainerHeight = 600;

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

  const calculateCanvasDimensions = (ratio: string, maxContainerWidth: number, maxContainerHeight: number) => {
    const [widthRatio, heightRatio] = ratio.split('/').map(num => parseFloat(num.trim()));
    const aspectRatioValue = widthRatio / heightRatio;

    let canvasWidth = maxContainerWidth;
    let canvasHeight = canvasWidth / aspectRatioValue;

    if (canvasHeight > maxContainerHeight) {
      canvasHeight = maxContainerHeight;
      canvasWidth = canvasHeight * aspectRatioValue;
    }

    return {
      width: canvasWidth,
      height: canvasHeight
    };
  };

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new Canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        preserveObjectStacking: true
      });
    }

    return () => {
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current && imageUploaded) {
      const canvas = fabricCanvasRef.current;
      canvas.clear();

      // Establecer el color de fondo
      canvas.backgroundColor = fillColor;
      canvas.renderAll();

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        Image.fromURL(result)
          .then((img) => {
            // Calcular factor de escala para ajustar la imagen al canvas sin distorsión
            const scale = Math.min(
              canvas.getWidth() / img.width!,
              canvas.getHeight() / img.height!
            );

            img.scale(scale);

            img.set({
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              originX: "center",
              originY: "center",
              selectable: true,
              hasControls: true,
              hasBorders: true,
              hasRotatingPoint: true
            });

            canvas.add(img);
            canvas.renderAll();
          })
          .catch((error) => {
            console.error("Error al cargar la imagen", error);
          });
      };

      reader.readAsDataURL(imageUploaded);
    }
  }, [imageUploaded, aspectRatio, fillColor]);

  useEffect(() => {
    if (fabricCanvasRef.current && imageUploaded) {
      const canvas = fabricCanvasRef.current;

      // Limpiar el canvas
      canvas.clear();

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        Image.fromURL(result)
          .then((img) => {
            // Obtener las dimensiones de la imagen
            const imgWidth = img.width!;
            const imgHeight = img.height!;
            const imgAspectRatio = imgWidth / imgHeight;

            // Calcular las dimensiones del canvas basadas en la imagen
            let canvasWidth = maxContainerWidth;
            let canvasHeight = canvasWidth / imgAspectRatio;

            if (canvasHeight > maxContainerHeight) {
              canvasHeight = maxContainerHeight;
              canvasWidth = canvasHeight * imgAspectRatio;
            }

            // Ajustar el tamaño del canvas
            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);

            // Actualizar el tamaño del elemento canvas en el DOM
            if (canvasRef.current) {
              canvasRef.current.width = canvasWidth;
              canvasRef.current.height = canvasHeight;
              canvasRef.current.style.width = `${canvasWidth}px`;
              canvasRef.current.style.height = `${canvasHeight}px`;
            }

            // Establecer el color de fondo
            canvas.setBackgroundColor(fillColor, canvas.renderAll.bind(canvas));

            // Escalar la imagen si es más grande que el canvas
            let scale = 1;
            if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
              scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
              img.scale(scale);
            }

            // Centrar la imagen en el canvas
            img.set({
              left: canvasWidth / 2,
              top: canvasHeight / 2,
              originX: "center",
              originY: "center",
              selectable: true,
              hasControls: true,
              hasBorders: true,
              hasRotatingPoint: true
            });

            canvas.add(img);
            canvas.renderAll();
          })
          .catch((error) => {
            console.error("Error al cargar la imagen", error);
          });
      };

      reader.readAsDataURL(imageUploaded);
    }
  }, [imageUploaded, fillColor]);

  const addFill = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.backgroundColor = fillColor;
    canvas.renderAll();
  };

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
                  <h3 className="font-semibold text-sm">Vista previa</h3>
                  <span
                    id="text-preview"
                    style={{
                      fontFamily: "New Times Roman",
                      fontWeight: textState.style?.bold ? "bold" : "normal",
                      fontStyle: textState.style?.italic ? "italic" : "normal",
                      textDecoration: textState.style?.underline ? "underline" : "none"
                    }}
                  >
                    {textState.value || "Lorem ipsum dolor sit amet."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-md">
                  Configurar canvas
                </CardTitle>
                <CardDescription>
                  Ajusta la relación de aspecto y el color de fondo del canvas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Relación de aspecto</Label>
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
                </div>

                <Separator className="my-2" />

                <div className="flex flex-col gap-2">
                  <Label>Color de fondo</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={fillColor}
                      onChange={(e) => setFillColor(e.target.value)}
                      className="w-full h-10"
                    />
                    <Button className="w-full mt-2" onClick={addFill}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        </ul>
      </section>

      <section className="w-[60%] flex justify-center">
        <div className="flex flex-col gap-3 items-center">
          <div
            className="border-[3px] border-dotted flex items-center justify-center"
            style={{
              width: maxContainerWidth,
              height: maxContainerHeight,
              overflow: 'hidden'
            }}
          >
            <canvas ref={canvasRef} id="canvas" />
          </div>
          <div>
            <Button
              onClick={() => {
                const dataURL = fabricCanvasRef.current?.toDataURL({
                  format: 'png',
                  quality: 1
                });
                const a = document.createElement("a");
                a.href = dataURL!;
                a.download = "image.png";
                a.click();
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