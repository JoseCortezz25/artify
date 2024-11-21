"use client";
import { Button } from '@/components/ui/button';
import { useEffect, forwardRef, useRef } from 'react';

import fabric from 'fabric';
import useBuilder from '@/stores/store';


const Sidebar = () => {
  return (
    <section className="rounded-lg bg-gray-100/50 px-3 py-3 max-w-[30%] gap-4">
      <ul className="flex flex-col gap-3">
        <li>
          <Button className="">
            Añadir imagen
          </Button>
        </li>
        <li>
          <Button className="">
            Añadir texto
          </Button>
        </li>
        <li>
          <Button className="">
            Añadir relleno a la foto
          </Button>
        </li>
      </ul>
    </section>
  );
};

const Playground = forwardRef<fabric.Canvas, {}>((props, ref) => {
  const { imageUploaded } = useBuilder();
  const canvasRef = useRef<fabric.Canvas | null>(null) as React.MutableRefObject<fabric.Canvas | null>;

  useEffect(() => {
    const canvas = new
      fabric.Canvas('canvas');
    canvasRef.current = canvas;

    if (imageUploaded) {
      fabric.Image.fromURL(URL.createObjectURL(imageUploaded), (img: any) => {
        img.set({
          left: 0,
          top: 0,
          angle: 0,
          padding: 10,
          cornersize: 10
        });
        canvas.add(img);
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
    };
  }, [imageUploaded]);

  return (
    <div className="w-[500px] h-[600px] border-[3px] border-dotted">
      <canvas id="canvas" className="w-full h-full" />
    </div>
  );
});


const Page = () => {
  const { imageUploaded } = useBuilder();

  const addText = (canvas: fabric.Canvas) => {
    const text = new fabric.Textbox('Hello Fabric!', {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      fill: '#000'
    });
    canvas.add(text);
    canvas.renderAll();
  };

  const fillCanvas = (canvas: fabric.Canvas, img: fabric.Image, aspectRatio: number) => {
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const imgAspectRatio = img.width! / img.height!;

    let scaleX = canvasWidth / img.width!;
    let scaleY = canvasHeight / img.height!;

    if (aspectRatio > imgAspectRatio) {
      scaleX = scaleY;
    } else {
      scaleY = scaleX;
    }

    img.scaleX = scaleX;
    img.scaleY = scaleY;
    img.setCoords();
    canvas.renderAll();
  };

  const canvasRef = useRef<fabric.Canvas | null>(null);

  const handleAddText = () => {
    if (canvasRef.current) {
      addText(canvasRef.current);
    }
  };

  const handleFillCanvas = () => {
    if (canvasRef.current && imageUploaded) {
      fabric.Image.fromURL(URL.createObjectURL(imageUploaded), (img) => {
        fillCanvas(canvasRef.current!, img, 1); // Example aspect ratio
      });
    }
  };

  return (
    <div className="flex gap-2 w-full h-screen">
      <div className="container flex justify-center gap-5 items-center">
        <Sidebar />
        <Playground ref={canvasRef} />
        <button onClick={handleAddText}>Add Text</button>
        <button onClick={handleFillCanvas}>Fill Canvas</button>
      </div>
    </div>
  );
};

export default Page;

Playground.displayName = 'Playground';