import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar
} from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { fetchClients } from '@actions/clients'

const getInitials = string =>
  string
    .split(/\s+/)
    .slice(0, 2)
    .reduce((response, word) => response + word[0].toUpperCase(), '')

const ClientList = ({ clients, setClients }) => {
  const { getToken } = useAuth()
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
  }, [getToken, setClients])

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
            <TableCell>Avatar</TableCell>
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
              <TableCell>
                <Avatar>{getInitials(client.full_name)}</Avatar>
              </TableCell>
              <TableCell>
                <Link href={`/clients/${client.id}`} passHref>
                  <Typography component='a' style={{ textDecoration: 'none', color: 'inherit' }}>
                    {client.full_name}
                  </Typography>
                </Link>
              </TableCell>
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
