"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { ImageOff } from "lucide-react";

type ProductImageProps = Readonly<{
  src?: string;
  alt: string;
  sizes?: string;
  /** Classes applied to the <img> itself (e.g. object-fit, hover transforms). */
  className?: string;
}>;

type Status = "loading" | "loaded" | "error";

/**
 * Product image with a professional loading experience:
 * - A shimmer placeholder fills the frame while the image downloads.
 * - The image fades in once loaded.
 * - A neutral fallback is shown when there is no image or it fails to load.
 *
 * The ref callback covers the case where the browser serves the image from
 * cache before hydration, so `onLoad` never fires — we detect `img.complete`.
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  className = "",
}: ProductImageProps) {
  const [status, setStatus] = useState<Status>(src ? "loading" : "error");

  const handleRef = useCallback((img: HTMLImageElement | null) => {
    if (!img || !img.complete) return;
    // Already loaded from cache: naturalWidth 0 means it failed to decode.
    setStatus(img.naturalWidth === 0 ? "error" : "loaded");
  }, []);

  if (status === "error" || !src) {
    return (
      <div
        role="img"
        aria-label={`${alt} — image unavailable`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400"
      >
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        <span className="text-xs font-medium">No image</span>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div className="skeleton absolute inset-0" aria-hidden="true" />
      )}
      <Image
        ref={handleRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`${className} transition-opacity duration-500 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
