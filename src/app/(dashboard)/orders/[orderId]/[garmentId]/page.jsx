import { getUserAndToken } from '@/utils/getUserAndToken'
import { getGarmentById, getStages } from '@/app/actions/garments'
import GarmentPageContent from '@/components/garments/GarmentPageContent'

export default async function GarmentPage({ params }) {
  const { orderId, garmentId } = params
  const { userId, token } = await getUserAndToken()

  if (!userId || !token) {
    return <div>You must be logged in to view this page.</div>
  }

  try {
    const [garment, stages] = await Promise.all([
      getGarmentById(userId, orderId, garmentId, token),
      getStages(userId, token)
    ])

    if (!garment) {
      return <div>Garment not found.</div>
    }

    return <GarmentPageContent initialGarment={garment} initialStages={stages} />
  } catch (error) {
    console.error('Failed to fetch data:', error)

    return <div>Error loading garment data. Please try again later.</div>
  }
}
