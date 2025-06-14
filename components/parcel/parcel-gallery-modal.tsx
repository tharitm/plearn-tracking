"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  images: string[]
  open: boolean
  onClose: () => void
}

export function ParcelGalleryModal({ images: propImages, open, onClose }: ParcelGalleryModalProps) {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [fetchedImages, setFetchedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const fetchImages = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("https://picsum.photos/v2/list?page=1&limit=6")
        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`)
        const data: LoremPicsumImage[] = await res.json()
        setFetchedImages(data.map((i) => i.download_url))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        setFetchedImages([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchImages()
  }, [open])

  const displayImages = fetchedImages.length ? fetchedImages : propImages
  if (!open) return null        // ปิด dialog = ไม่เรนเดอร์

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        {/* ชื่อ dialog ซ่อนไว้ (sr-only) เพื่อให้ผ่าน accessibility checker */}
        <DialogHeader>
          <DialogTitle className="sr-only">แกลเลอรีรูปภาพพัสดุ</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex h-48 items-center justify-center">กำลังโหลดรูปภาพ…</div>
        )}

        {error && !isLoading && (
          <div className="flex h-48 items-center justify-center text-red-500">
            Error: {error}
          </div>
        )}

        {!isLoading && !error && displayImages.length === 0 && (
          <div className="flex h-48 items-center justify-center">ไม่มีรูปภาพ</div>
        )}

        {!isLoading && !error && displayImages.length > 0 && (
          <>
            <div className="flex flex-wrap gap-4">
              {displayImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-[100px] w-[100px] cursor-pointer"
                  onMouseEnter={() => setEnlargedImage(src)}
                  onMouseLeave={() => setEnlargedImage(null)}
                >
                  <Image
                    src={src}
                    alt={`parcel-${idx}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>

            {enlargedImage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative h-[80vh] w-[80vw]">
                  <Image
                    src={enlargedImage}
                    alt="enlarged-parcel"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}