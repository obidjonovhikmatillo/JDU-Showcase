import Image, { type ImageProps } from "next/image";

import {
  isLocalUploadPath,
  normalizeImageSrcForDisplay,
} from "@/lib/uploads/uploaded-image-url";

type UploadImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function UploadImage({ src, alt = "", ...props }: UploadImageProps) {
  const normalizedSrc = normalizeImageSrcForDisplay(src);

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      unoptimized={isLocalUploadPath(normalizedSrc)}
      {...props}
    />
  );
}
