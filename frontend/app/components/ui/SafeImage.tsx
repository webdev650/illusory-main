"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";

import { cleanCloudinaryUrl } from "../../lib/cloudinary";

const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MTcxNyIvPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZCIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjYyNjI2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGEwYTBhIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjgsIDEwOCkiIHN0cm9rZT0iIzQwNDA0MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxyZWN0IHg9IjAiIHk9IjgiIHdpZHRoPSI2NCIgaGVpZ2h0PSI0OCIgcng9IjgiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjI0IiByPSI2Ii8+PHBhdGggZD0iTTQgNDYgbDE4LTE4IDE2IDE2IDgtOCAxMCAxMCIvPjwvZz48dGV4dCB4PSI1MCUiIHk9IjE5MCIgZmlsbD0iIzczNzM3MyIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCIgbGV0dGVyLXNwYWNpbmc9IjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklMTFVTT1JZIERFU0lHTiBTVFVESU9TPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iMjEwIiBmaWxsPSIjNDA0MDQwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjExIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";

export interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | StaticImageData | null;
  fallbackSrc?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = "Image",
  fallbackSrc = FALLBACK_IMAGE,
  containerClassName = "",
  className = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(FALLBACK_IMAGE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync state with incoming src prop changes
  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      setIsLoading(false);
      setIsError(true);
      return;
    }

    const sanitizedSrc = cleanCloudinaryUrl(src);
    setImgSrc(sanitizedSrc);
    setIsLoading(true);
    setIsError(false);
  }, [src, fallbackSrc]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    if (props.onLoad) {
      props.onLoad(e);
    }
  };

  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
    setImgSrc(fallbackSrc);
  };

  // Prevent SSR hydration mismatch for dynamic content
  if (!isMounted) {
    return (
      <div className={`relative bg-neutral-900 animate-pulse overflow-hidden ${containerClassName}`}>
        <div className="w-full h-full" />
      </div>
    );
  }

  // Check if it is a fill image or bounded
  const isFill = props.fill || !props.width || !props.height;

  return (
    <div className={`relative overflow-hidden group/safe-image ${containerClassName} ${isFill ? "w-full h-full" : ""}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-neutral-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-[length:200%_100%] animate-pulse" />
          {/* Subtle logo pulse */}
          <span className="text-[10px] tracking-[0.2em] font-medium text-neutral-600 animate-pulse select-none z-20">
            ILLUSORY
          </span>
        </div>
      )}

      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={`transition-all duration-500 ${
          isLoading ? "scale-105 blur-md" : "scale-100 blur-0"
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default SafeImage;
