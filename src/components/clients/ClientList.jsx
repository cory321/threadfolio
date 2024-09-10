import React, { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'
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
  TablePagination,
  Box,
  Button,
  TableSortLabel
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { useAuth } from '@clerk/nextjs'
import { styled } from '@mui/material/styles'

import { fetchClients } from '@actions/clients'
import InitialsAvatar from '@/components/InitialsAvatar'
import ClientSearch from './ClientSearch'

const StyledLink = styled(Button)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.contrastText,
  padding: '8px 16px',
  borderRadius: theme.shape.borderRadius,
  transition: 'none',
  textTransform: 'none',
  fontWeight: 'bold',
  width: '100%',
  justifyContent: 'center', // Center the text
  '&:hover': {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main
  }
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2) // Increase padding
}))

const ClientList = ({ clients: initialClients, setClients }) => {
  const { getToken, userId } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [localClients, setLocalClients] = useState(initialClients || [])
  const [searchResults, setSearchResults] = useState(null)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('full_name')

  const loadClients = useCallback(
    async (newPage, newRowsPerPage, newOrderBy, newOrder) => {
      if (!userId) return
      setIsLoading(true)
      setError(null)

      try {
        const token = await getToken({ template: 'supabase' })

        const { clients: clientsData, totalCount } = await fetchClients(
          token,
          newPage + 1,
          newRowsPerPage,
          userId,
          newOrderBy,
          newOrder
        )

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
    [getToken, setClients, userId]
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    loadClients(newPage, rowsPerPage, orderBy, order)
  }

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)

    setRowsPerPage(newRowsPerPage)
    setPage(0)
    loadClients(0, newRowsPerPage, orderBy, order)
  }

  const handleRequestSort = property => event => {
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'

    setOrder(newOrder)
    setOrderBy(property)
    loadClients(page, rowsPerPage, property, newOrder)
  }

  const handleClientSelect = selectedClient => {
    router.push(`/clients/${selectedClient.id}`)
  }

  const displayedClients = searchResults || localClients

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  return (
    <>
      {displayedClients.length === 0 ? (
        <Typography>No clients found.</Typography>
      ) : (
        <>
          <Box mb={4}>
            <ClientSearch userId={userId} onClientSelect={handleClientSelect} />
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Avatar</StyledTableCell>
                  <StyledTableCell sortDirection={orderBy === 'full_name' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'full_name'}
                      direction={orderBy === 'full_name' ? order : 'asc'}
                      onClick={handleRequestSort('full_name')}
                    >
                      Full Name
                      {orderBy === 'full_name' ? (
                        <Box component='span' sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone Number</StyledTableCell>
                  <StyledTableCell>Mailing Address</StyledTableCell>
                  <StyledTableCell>Notes</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedClients.map(client => (
                  <TableRow key={client.id} sx={{ '& > *': { paddingTop: 2, paddingBottom: 2 } }}>
                    <StyledTableCell>
                      <InitialsAvatar fullName={client.full_name} />
                    </StyledTableCell>
                    <StyledTableCell padding='none'>
                      <Link href={`/clients/${client.id}`} passHref legacyBehavior>
                        <StyledLink component='a' variant='contained' color='primary'>
                          {client.full_name}
                        </StyledLink>
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>{client.email}</StyledTableCell>
                    <StyledTableCell>{client.phone_number}</StyledTableCell>
                    <StyledTableCell>{client.mailing_address}</StyledTableCell>
                    <StyledTableCell>{client.notes}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!searchResults && (
            <TablePagination
              component='div'
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              disabled={isLoading}
            />
          )}
        </>
      )}
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
