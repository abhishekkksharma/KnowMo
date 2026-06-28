"use client"

import React from 'react';
import Image from 'next/image';
import { StaticImageData } from "next/image";

interface ContentBlockProps {
  text: React.ReactNode;
  imageUrl: string | StaticImageData;
  imageAlt: string;
  imagePosition?: "left" | "right";
}

export default function ContentBlock({
  text,
  imageUrl,
  imageAlt,
  imagePosition = 'left',
}: ContentBlockProps) {
  const layoutDirection = imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse';

  return (
    <section 
      className={`flex flex-col gap-10 md:gap-16 items-center my-20 w-full ${layoutDirection}`}
    >
      {/* Image Container */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-full max-w-md aspect-video md:aspect-square">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="md:object-cover object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Text Container - Added dark:text-gray-100 here */}
      <div className="w-full md:w-1/2 text-gray-800 font-mono dark:text-gray-100 text-lg leading-relaxed space-y-6">
        {text}
      </div>
    </section>
  );
}