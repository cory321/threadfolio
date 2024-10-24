'use client'

import dynamic from 'next/dynamic'

const GarmentListTable = dynamic(() => import('@/app/apps/user/view/user-right/overview/GarmentListTable'))

const OrdersTab = () => {
  return <GarmentListTable />
}

export default OrdersTab
