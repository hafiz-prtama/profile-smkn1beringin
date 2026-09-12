import React, { useState, useEffect } from "react";
import Image from "next/image";

// ─── Komponen Carousel Kegiatan (Tailwind) ─────────────────────────────────
export default function ActivityCarousel({ photos = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative w-full max-w-[800px] h-[300px] md:h-[450px] mx-auto perspective-1000">
      <div className="absolute w-full h-full transform-style-3d flex items-center justify-center">
        {photos.map((photo, i) => {
          let posClass = "hidden";
          let styleClass = "";
          const diff = (i - activeIndex + photos.length) % photos.length;

          // Mengganti CSS .pos-active, .pos-next-1 dsb dengan Tailwind transform
          if (diff === 0) {
            styleClass = "z-50 translate-x-0 translate-z-0 scale-100 opacity-100 blur-0 shadow-2xl";
          } else if (diff === 1) {
            styleClass = "z-40 translate-x-[40%] md:translate-x-[60%] -translate-z-[100px] scale-90 opacity-60 blur-sm shadow-xl";
          } else if (diff === 2) {
            styleClass = "z-30 translate-x-[70%] md:translate-x-[110%] -translate-z-[200px] scale-75 opacity-20 blur-md shadow-lg";
          } else if (diff === photos.length - 1) {
            styleClass = "z-40 -translate-x-[40%] md:-translate-x-[60%] -translate-z-[100px] scale-90 opacity-60 blur-sm shadow-xl";
          } else if (diff === photos.length - 2) {
            styleClass = "z-30 -translate-x-[70%] md:-translate-x-[110%] -translate-z-[200px] scale-75 opacity-20 blur-md shadow-lg";
          } else {
            styleClass = "hidden"; // pos-hidden
          }

          if (styleClass !== "hidden") {
            posClass = `absolute w-[240px] md:w-[400px] h-full rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 ease-in-out ${styleClass}`;
          }

          return (
            <div key={photo.id || i} className={posClass}>
              {styleClass !== "hidden" && (
                <>
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-10" />
                  <Image
                    src={photo.image}
                    alt="Kegiatan"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                    unoptimized={typeof photo.image === "string" && (photo.image.startsWith("data:") || photo.image.endsWith(".svg"))}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
