import { GarmentServiceOrderProvider } from '@/app/contexts/GarmentServiceOrderContext'

export default function GarmentServiceOrderLayout({ children }) {
  return <GarmentServiceOrderProvider>{children}</GarmentServiceOrderProvider>
}
