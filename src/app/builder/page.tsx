"use client";
import { Button } from '@/components/ui/button';
import { useEffect, forwardRef, useRef } from 'react';
import useBuilder from '@/stores/store';
import { Playground } from '@/components/playground';

const Page = () => {
  const { imageUploaded } = useBuilder();

  return (
    <div className="flex gap-2 w-full h-screen">
      <div className="container flex justify-center gap-5 items-center">
        <Playground imageUploaded={imageUploaded} />
        <button >Add Text</button>
        <button >Fill Canvas</button>
      </div>
    </div>
  );
};

export default Page;