import Link from 'next/link'

import { Button } from '@mui/material'

export default function OrdersPage() {
  return (
    <>
      <h1>Orders</h1>
      <Link href='/orders/create' passHref>
        <Button variant='contained' color='primary'>
          Create Order
        </Button>
      </Link>
    </>
  )
}
