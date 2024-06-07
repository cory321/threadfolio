// eslint-disable-next-line import/named
import { v2 as cloudinary } from 'cloudinary'
import { currentUser } from '@clerk/nextjs/server'

import SingleFileUploadWithGallery from '@/components/media/SingleFileUploadWithGallery'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function PhotoGallery() {
  const user = await currentUser()

  if (!user) {
    // In practice, this should never happen if Clerk is correctly configured
    return <p>Redirecting to login...</p>
  }

  const clientId = 'client321' // For testing purposes
  const UPLOAD_PATH = `${user.id}/${clientId}/`
  const MAX_RESULTS = 50

  const { resources } = await cloudinary.api.resources({
    type: 'upload',
    prefix: UPLOAD_PATH,
    max_results: MAX_RESULTS
  })

  return (
    <div>
      <SingleFileUploadWithGallery userId={user.id} clientId={clientId} resources={resources} />
    </div>
  )
}
