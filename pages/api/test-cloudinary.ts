import { NextApiRequest, NextApiResponse } from 'next'
import { CLOUDINARY_CONFIG } from '@/lib/constants'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
  })
} 