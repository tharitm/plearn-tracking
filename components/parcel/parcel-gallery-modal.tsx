"use client"

import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface ParcelGalleryModalProps {
  images: string[]
  open: boolean
  onClose: () => void
}

export function ParcelGalleryModal({ images, open, onClose }: ParcelGalleryModalProps) {
  if (images.length === 0) return null

  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={images.map(src => ({ src }))}
    />
  )
}
