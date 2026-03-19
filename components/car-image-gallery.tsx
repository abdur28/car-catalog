"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  images: string[];
  alt: string;
}

export function CarImageGallery({ images, alt }: Props) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-display text-lg">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/10] bg-muted rounded-lg overflow-hidden group">
        <Image
          src={images[current]}
          alt={`${alt} - Photo ${current + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          unoptimized
        />
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-90 transition-opacity bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() =>
                setCurrent((c) => (c - 1 + images.length) % images.length)
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-90 transition-opacity bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => setCurrent((c) => (c + 1) % images.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-20 shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                i === current
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
