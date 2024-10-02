import { auth } from '@clerk/nextjs/server'

import { getGarmentById } from '@/app/actions/garments'
import { getStages } from '@/app/actions/garmentStages'
import GarmentPageContent from '@/components/garments/GarmentPageContent'

export default async function GarmentPage({ params }) {
  const { orderId, garmentId } = params
  const { userId } = auth()

  try {
    const [garment, stages] = await Promise.all([getGarmentById(userId, orderId, garmentId), getStages(userId)])

    if (!garment) {
      return <div>Garment not found.</div>
    }

    return <GarmentPageContent initialGarment={garment} initialStages={stages} />
  } catch (error) {
    console.error('Failed to fetch data:', error)

    return <div>Error loading garment data. Please try again later.</div>
  }
}
