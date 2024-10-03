'use client'

import { Box, Button, Link } from '@mui/material'

export default function OrdersHeader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 2 }}>
      <h1>Orders</h1>
      <Link href='/orders/create' passHref>
        <Button variant='contained' color='primary'>
          Create Order
        </Button>
      </Link>
    </Box>
  )
}
