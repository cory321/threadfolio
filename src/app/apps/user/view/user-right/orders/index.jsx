'use client'

// MUI Imports
import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Dynamic Imports
const GarmentListTable = dynamic(() => import('@/app/apps/user/view/user-right/GarmentListTable'))

const OrdersTab = () => {
  return <GarmentListTable />
}

export default OrdersTab
