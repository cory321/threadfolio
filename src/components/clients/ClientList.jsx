'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { fetchClients } from '@actions/clients'

const ClientList = () => {
  const { getToken } = useAuth()
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadClients = async () => {
      const token = await getToken({ template: 'supabase' })

      setIsLoading(true)
      setError(null)

      try {
        const clientsData = await fetchClients(token)

        setClients(clientsData)
      } catch (err) {
        console.error('Error fetching clients:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [getToken])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Mailing Address</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell>{client.full_name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone_number}</TableCell>
              <TableCell>{client.mailing_address}</TableCell>
              <TableCell>{client.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ClientList
