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


const Playground = ({ imageUploaded }: { imageUploaded: File | null }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialState: TextState = { value: "", style: { bold: false, italic: false, underline: false } };
  const [textState, textDispatch] = useReducer<(state: TextState, action: TextAction) => TextState>(reducerText, initialState);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    // Inicializar el canvas de Fabric.js una vez
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new Canvas(canvasRef.current, {
        width: 500,
        height: 600
      });
    }

    // Limpiar el canvas al desmontar
    return () => {
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current && imageUploaded) {
      // Limpiar el canvas antes de añadir la nueva imagen
      fabricCanvasRef.current.clear();

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        Image.fromURL(result)
          .then((img) => {
            const canvas = fabricCanvasRef.current!;
            const scale = canvas.getWidth() / img.width!;
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

      reader.readAsDataURL(imageUploaded); // Convertir el archivo en Data URL
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

        <ul className="flex flex-col gap-3 ">
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
                    onChange={(e) => textDispatch(
                      {
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
                  <ToggleGroup type="multiple" onValueChange={(value) => textDispatch(
                    {
                      type: "SET_STYLE",
                      payload: {
                        value: textState.value,
                        style: formatValueFontStyle(value)
                      }
                    })

                  }>
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
                  <h3 className=" font-semibold text-sm">Preview</h3>
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
            <Button className="">
              Añadir relleno a la foto
            </Button>
          </li>
        </ul>
        {/* </CardContent>
        </Card> */}
      </section>

      <section className="w-[60%] flex justify-center">
        <div className="w-[500px] h-[600px] border-[3px] border-dotted">
          <canvas ref={canvasRef} id="canvas" className="w-full h-full" />
        </div>
      </section>
    </section>
  );
};

export { Playground };