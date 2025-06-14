"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DEFAULT_THUMBNAIL } from "@/lib/constants"
import { PhotoProvider, PhotoView } from "react-photo-view"
import 'react-photo-view/dist/react-photo-view.css'

interface ParcelGalleryModalProps {
  images: string[]
  open: boolean
  onClose: () => void
}

export function ParcelGalleryModal({ images, open, onClose }: ParcelGalleryModalProps) {
  const displayImages = images && images.length > 0 ? images : []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>รูปภาพพัสดุ</DialogTitle>
        </DialogHeader>
        {displayImages.length > 0 ? (
          <PhotoProvider>
            <div className="grid grid-cols-3 gap-4">
              {displayImages.map((src, idx) => (
                <PhotoView key={idx} src={src}>
                  <img
                    src={src}
                    alt={`parcel-image-${idx}`}
                    className="h-24 w-24 cursor-pointer rounded object-cover"
                  />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        ) : (
          <img
            src={DEFAULT_THUMBNAIL}
            alt="no image"
            className="mx-auto max-h-[70vh] object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
