'use client'
import { CldImage, CldUploadButton } from 'next-cloudinary'

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Page() {
  return <CldUploadButton uploadPreset='my-uploads' />
}
