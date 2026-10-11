"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { youtubeThumbnailCandidates } from "@/lib/youtube";

type Props = {
  imageUrl?: string;
  youtubeUrl?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Displayed when there is no image and no valid YouTube video. */
  fallback: ReactNode;
};

function Inner({
  candidates,
  alt,
  sizes,
  priority,
  className,
  fallback,
}: Omit<Props, "imageUrl" | "youtubeUrl"> & { candidates: string[] }) {
  const [index, setIndex] = useState(0);
  const src = candidates[index];
  if (!src) return <>{fallback}</>;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      // YouTube thumbnails are already optimized, so remotePatterns configuration is unnecessary.
      unoptimized={src.startsWith("https://i.ytimg.com/")}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

/**
 * Recipe image: prefer imageUrl; if it is empty or fails to load, use the YouTube video thumbnail
 * (maxres → hqdefault); show `fallback` only if those options are unavailable.
 */
export default function RecipeImage({ imageUrl, youtubeUrl, ...rest }: Props) {
  const candidates = [
    ...(imageUrl?.trim() ? [imageUrl.trim()] : []),
    ...youtubeThumbnailCandidates(youtubeUrl),
  ].filter((src, i, all) => all.indexOf(src) === i);
  return <Inner key={candidates.join("|")} candidates={candidates} {...rest} />;
}
