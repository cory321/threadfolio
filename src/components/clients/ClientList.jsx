import React, { useEffect, useState, useCallback } from 'react'

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

const ClientList = ({ clients: initialClients, setClients }) => {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [localClients, setLocalClients] = useState(initialClients || [])

  const loadClients = useCallback(
    async (newPage, newRowsPerPage) => {
      setIsLoading(true)
      setError(null)

      try {
        const token = await getToken({ template: 'supabase' })
        const { clients: clientsData, totalCount } = await fetchClients(token, newPage + 1, newRowsPerPage)

        setLocalClients(clientsData)
        setClients(clientsData)
        setTotalCount(totalCount)
      } catch (err) {
        console.error('Error fetching clients:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [getToken, setClients]
  )

  useEffect(() => {
    if (!initialClients || initialClients.length === 0) {
      loadClients(page, rowsPerPage)
    } else {
      setLocalClients(initialClients)
    }
  }, [initialClients, loadClients, page, rowsPerPage])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    loadClients(newPage, rowsPerPage)
  }

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)

    setRowsPerPage(newRowsPerPage)
    setPage(0)
    loadClients(0, newRowsPerPage)
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  return (
    <>
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
            {localClients.map(client => (
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
        component='div'
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        disabled={isLoading}
      />
      {isLoading && (
        <CircularProgress
          size={24}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12
          }}
        />
      )}
    </>
  )
}

export default ClientList
