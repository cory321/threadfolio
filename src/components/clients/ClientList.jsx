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
  TablePagination
} from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { fetchClients } from '@actions/clients'
import InitialsAvatar from '@/components/InitialsAvatar'

const ClientList = ({ clients, setClients }) => {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  return (
    <Paper>
      <TableContainer>
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
            {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(client => (
              <TableRow key={client.id}>
                <TableCell>
                  <InitialsAvatar fullName={client.full_name} />
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={clients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default ClientList
