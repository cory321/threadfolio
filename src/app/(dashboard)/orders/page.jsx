'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { getOrders } from '@/app/actions/garments'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, getToken } = useAuth()

  useEffect(() => {
    async function fetchOrders() {
      if (userId) {
        try {
          setIsLoading(true)
          const token = await getToken({ template: 'supabase' })

          if (!token) throw new Error('Failed to retrieve token')

          const fetchedOrders = await getOrders(userId, token)

          setOrders(fetchedOrders)
        } catch (error) {
          console.error('Failed to fetch orders:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchOrders()
  }, [userId, getToken])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Typography variant='h4' component='h1' gutterBottom>
        Orders
      </Typography>
      <Link href='/orders/create' passHref>
        <Button variant='contained' color='primary' style={{ marginBottom: '20px' }}>
          Create Order
        </Button>
      </Link>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Garments</TableCell>
                <TableCell>Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{order.client_name}</TableCell>
                  <TableCell>
                    {order.garments.map(garment => (
                      <div key={garment.id}>
                        <strong>{garment.name}</strong> - {garment.stage}
                        <ul>
                          {garment.services.map(service => (
                            <li key={service.id}>
                              {service.name}: {service.qty} x ${service.unit_price} ({service.unit})
                            </li>
                          ))}
                        </ul>
                        Garment Total: ${garment.total_price.toFixed(2)}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>${order.total_price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
