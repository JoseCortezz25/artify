"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImagePlus, Edit, RatioIcon as AspectRatio, PaintBucket, Type, ImageIcon } from 'lucide-react';
import { useState } from "react";


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <CardContent className="flex flex-col items-center p-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleImageUpload = (event) => {
    if (event.target.files.length > 0) {
      setImageUploaded(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-neutral-800">Artify</h1>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-24 md:py-32">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-5xl md:text-6xl leading-6xl font-extrabold mb-6 py-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-neutral-700/80">
              Edición de imágenes simplificada
            </h2>
            <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
              Transforma tus imágenes con facilidad. Ajusta, personaliza y crea contenido visual impactante en minutos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full sm:w-64"
              />
              <Button
                size="lg"
                className={`transition-all duration-300 ease-in-out ${imageUploaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                disabled={!imageUploaded}
              >
                Empezar a editar
              </Button>
            </div>
          </div>
        </section>

        <Separator className="w-[60%] mx-auto" />

        <section className="py-24 ">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-16 text-center">Características poderosas, interfaz intuitiva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Edit className="w-12 h-12" />}
                title="Edición básica"
                description="Herramientas esenciales para mejorar tus imágenes en segundos"
              />
              <FeatureCard
                icon={<AspectRatio className="w-12 h-12" />}
                title="Ajuste de relación de aspecto"
                description="Optimiza tus imágenes para cualquier plataforma con un solo clic"
              />
              <FeatureCard
                icon={<PaintBucket className="w-12 h-12" />}
                title="Cambio de fondo"
                description="Transforma el fondo de tus imágenes con nuestra tecnología avanzada"
              />
              <FeatureCard
                icon={<Type className="w-12 h-12" />}
                title="Añadir texto"
                description="Personaliza tus imágenes con una amplia variedad de fuentes y estilos"
              />
              <FeatureCard
                icon={<ImageIcon className="w-12 h-12" />}
                title="Superposición de imágenes"
                description="Crea composiciones únicas combinando múltiples imágenes"
              />
              <FeatureCard
                icon={<ImagePlus className="w-12 h-12" />}
                title="Añadir bordes"
                description="Dale el toque final perfecto a tus imágenes con bordes personalizados"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto py-8 px-4 text-sm text-muted-foreground">
          <p>Created by <u>@josecortezz25</u></p>
        </div>
      </footer>
    </div>
  );
}
