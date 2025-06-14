"use client"

import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState, useEffect } from "react"

interface LoremPicsumImage {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

interface ParcelGalleryModalProps {
  images: string[] // Keep existing prop as a fallback
  open: boolean
  onClose: () => void
}

export function ParcelGalleryModal({ images: propImages, open, onClose }: ParcelGalleryModalProps) {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [fetchedImages, setFetchedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      const fetchImages = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch("https://picsum.photos/v2/list?page=1&limit=6")
          if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.statusText}`)
          }
          const data: LoremPicsumImage[] = await response.json()
          setFetchedImages(data.map(img => img.download_url))
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred")
          setFetchedImages([]) // Clear any previously fetched images on error
        } finally {
          setIsLoading(false)
        }
      }
      fetchImages()
    }
  }, [open])

  const displayImages = fetchedImages.length > 0 ? fetchedImages : propImages

  if (displayImages.length === 0 && !isLoading && !error) return null
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl flex items-center justify-center h-48">
          <div>Loading images...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl flex items-center justify-center h-48">
          <div>Error: {error}</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (displayImages.length === 0) return null


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="flex flex-wrap gap-4">
          {displayImages.map((src, idx) => (
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
