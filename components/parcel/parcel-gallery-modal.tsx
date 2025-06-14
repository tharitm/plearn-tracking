"use client"

import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"

interface ParcelGalleryModalProps {
  images: string[]
  open: boolean
  onClose: () => void
}

export function ParcelGalleryModal({ images, open, onClose }: ParcelGalleryModalProps) {
  if (images.length === 0) return null
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="flex flex-wrap gap-4">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="w-[100px] h-[100px] relative cursor-pointer"
              onMouseEnter={() => setEnlargedImage(src)}
              onMouseLeave={() => setEnlargedImage(null)}
            >
              <Image
                src={src}
                alt={`parcel-image-${idx}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
        {enlargedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-[80vw] h-[80vh]">
              <Image
                src={enlargedImage}
                alt="enlarged-parcel-image"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
