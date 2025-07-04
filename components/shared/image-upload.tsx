"use client"

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X, Upload, ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import imageCompression from 'browser-image-compression'

const MAX_TOTAL_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const MAX_FILE_SIZE = 500 * 1024 // 500KB in bytes

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onFilesSelected: (files: File[]) => Promise<void>
  className?: string
  isUploading?: boolean
}

export function ImageUpload({
  images = [],
  onImagesChange,
  onFilesSelected,
  className,
  isUploading = false,
}: ImageUploadProps) {
  const [totalSize, setTotalSize] = useState<number>(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; size: number }[]>([])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const compressImage = async (file: File) => {
    if (file.size <= MAX_FILE_SIZE) return file

    const options = {
      maxSizeMB: MAX_FILE_SIZE / (1024 * 1024), // Convert to MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8
    }

    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('Error compressing image:', error)
      return file
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setIsCompressing(true)
    try {
      // Compress files if needed
      const compressedFiles = await Promise.all(
        acceptedFiles.map(file => compressImage(file))
      )

      // Calculate new total size
      const newTotalSize = compressedFiles.reduce((sum, file) => sum + file.size, 0)

      if (newTotalSize + totalSize > MAX_TOTAL_SIZE) {
        alert('ขนาดไฟล์รวมเกิน 5MB กรุณาลองใหม่อีกครั้ง')
        return
      }

      // Add new files to uploadedFiles
      const newUploadedFiles = compressedFiles.map(file => ({
        url: URL.createObjectURL(file),
        size: file.size
      })).filter(file => typeof file.url === 'string' && file.url !== '')
      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
      setTotalSize(current => current + newTotalSize)
      await onFilesSelected(compressedFiles)
    } catch (error) {
      console.error('Error processing files:', error)
    } finally {
      setIsCompressing(false)
    }
  }, [onFilesSelected, totalSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isUploading || isCompressing
  })

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)

    // Update total size by removing the file size
    if (uploadedFiles[index]) {
      setTotalSize(current => Math.max(0, current - uploadedFiles[index].size))
      const newUploadedFiles = [...uploadedFiles]
      newUploadedFiles.splice(index, 1)
      setUploadedFiles(newUploadedFiles)
    }

    onImagesChange(newImages)
  }

  // Calculate progress percentage
  const progress = Math.min((totalSize / MAX_TOTAL_SIZE) * 100, 100)

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.url))
    }
  }, [uploadedFiles])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.filter(image => typeof image === 'string' && image !== '').map((image, index) => (
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
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50',
          (isUploading || isCompressing) && 'cursor-wait opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-xs w-full">
          {isUploading || isCompressing ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-600">
                {isCompressing ? 'กำลังบีบอัดรูปภาพ...' : 'กำลังอัพโหลด...'}
              </p>
            </>
          ) : (
            <>
              <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG หรือ WEBP</p>
              <div className="w-full max-w-xs mt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>ขนาดไฟล์</span>
                  <span>{formatFileSize(totalSize)}</span>
                </div>
                <Progress
                  value={progress}
                  className={cn(
                    "h-2 transition-colors",
                    progress >= 90 ? "bg-red-200" :
                      progress >= 70 ? "bg-yellow-200" :
                        "bg-green-200",
                    "[&>div]:transition-colors",
                    progress >= 90 ? "[&>div]:bg-red-500" :
                      progress >= 70 ? "[&>div]:bg-yellow-500" :
                        "[&>div]:bg-green-500"
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 