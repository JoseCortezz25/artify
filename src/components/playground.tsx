"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Canvas, Image, IText } from "fabric";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Playground = ({ imageUploaded }: { imageUploaded: File | null }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      const textObject = new IText(text, {
        left: fabricCanvasRef.current.getWidth() / 2,
        top: fabricCanvasRef.current.getHeight() / 2,
        originX: "center",
        originY: "center",
        fontSize: 24,
        fill: "black",
        selectable: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true
      });

      fabricCanvasRef.current.add(textObject);
      fabricCanvasRef.current.renderAll();
    }
  };


  return (
    <section>
      <ul className="flex flex-col gap-3">
        <li>
          <Button className="">
            Añadir imagen
          </Button>
        </li>
        <li>
          <Input
            type="text"
            placeholder="Escribe el texto"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <Button onClick={addTextIntoCanvas}>
            Añadir texto
          </Button>

        </li>
        <li>
          <Button className="">
            Añadir relleno a la foto
          </Button>
        </li>
      </ul>
      {/* <Sidebar canvasRef={canvasRef} fabricCanvasRef={fabricCanvasRef} /> */}
      <div className="w-[500px] h-[600px] border-[3px] border-dotted">
        <canvas ref={canvasRef} id="canvas" className="w-full h-full" />
      </div>
    </section>
  );
};

export { Playground };