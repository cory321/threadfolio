import { getUserAndToken } from '@/utils/getUserAndToken'
import { addGarmentService, updateServiceDoneStatus } from '@/app/actions/garmentServices'
import { getGarmentById, updateGarment } from '@/app/actions/garments'
import { getStages } from '@/app/actions/garmentStages'
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

    async function handleAddGarmentService(service) {
      'use server'

      const newService = {
        garment_id: garment.id,
        name: service.name,
        description: service.description || '',
        qty: service.qty || 1,
        unit_price: parseFloat(service.unit_price),
        unit: service.unit
      }

      const addedService = await addGarmentService(userId, newService, token)

      return addedService
    }

    async function handleUpdateServiceDoneStatus(serviceId, newStatus) {
      'use server'

      await updateServiceDoneStatus(userId, serviceId, newStatus, token)
    }

    async function updateGarmentNotes(newNotes) {
      'use server'

      await updateGarment(userId, garment.id, { notes: newNotes }, token)
    }

    return (
      <GarmentPageContent
        initialGarment={garment}
        initialStages={stages}
        handleAddGarmentService={handleAddGarmentService}
        handleUpdateServiceDoneStatus={handleUpdateServiceDoneStatus}
        userId={userId}
        token={token}
        updateGarmentNotes={updateGarmentNotes}
      />
    )
  } catch (error) {
    console.error('Failed to fetch data:', error)

    return <div>Error loading garment data. Please try again later.</div>
  }
}
