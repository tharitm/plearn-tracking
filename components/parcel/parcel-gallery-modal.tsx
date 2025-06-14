"use client"

import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ParcelGalleryModalProps {
  images: string[]
  open: boolean
  onClose: () => void
}

export function ParcelGalleryModal({ images, open, onClose }: ParcelGalleryModalProps) {
  if (images.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                <Image
                  src={src}
                  alt={`parcel-image-${idx}`}
                  width={800}
                  height={600}
                  className="object-contain max-h-[70vh]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
