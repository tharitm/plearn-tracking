"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X, Upload, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onFilesSelected: (files: File[]) => Promise<void>
  maxFiles?: number
  className?: string
  isUploading?: boolean
}

export function ImageUpload({
  images = [],
  onImagesChange,
  onFilesSelected,
  maxFiles = 5,
  className,
  isUploading = false,
}: ImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await onFilesSelected(acceptedFiles)
    }
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles,
    disabled: isUploading
  })

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onImagesChange(newImages)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={image} className="group relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50',
            isUploading && 'cursor-wait opacity-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-xs">
            {isUploading ? (
              <>
                <Loader2 className="mb-2 h-8 w-8 animate-spin text-gray-400" />
                <p className="text-sm text-gray-600">กำลังอัพโหลด...</p>
              </>
            ) : (
              <>
                <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG หรือ WEBP ไม่เกิน 5MB</p>
                <p className="text-xs text-gray-500">
                  สามารถอัพโหลดได้สูงสุด {maxFiles} รูป (เหลือ {maxFiles - images.length} รูป)
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 