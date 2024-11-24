"use client";
import { Button } from '@/components/ui/button';
import { useEffect, forwardRef, useRef } from 'react';
import useBuilder from '@/stores/store';
import { Playground } from '@/components/playground';


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



const Page = () => {
  const { imageUploaded } = useBuilder();

  return (
    <div className="flex gap-2 w-full h-screen">
      <div className="container flex justify-center gap-5 items-center">
        <Sidebar />
        <Playground imageUploaded={imageUploaded} />
        <button >Add Text</button>
        <button >Fill Canvas</button>
      </div>
    </div>
  );
};

export default Page;