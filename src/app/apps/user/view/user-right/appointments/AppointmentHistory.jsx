import React, { useState, useEffect, useCallback } from 'react'

import { Card, CardHeader, CardContent, Typography, Box, TablePagination, Skeleton } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import debounce from 'lodash/debounce'

import AppointmentList from './AppointmentList'
import { getClientAppointments } from '@/app/actions/appointments'

const AppointmentHistory = ({ clientId }) => {
  const { getToken, userId } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const pageSize = 10

  const fetchAppointments = useCallback(
    async (pageNumber, pageSize) => {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })

        const { appointments: newAppointments, totalCount } = await getClientAppointments(
          userId,
          clientId,
          token,
          pageNumber + 1,
          pageSize,
          true
        )

        setAppointments(newAppointments)
        setTotalCount(totalCount)
        setError(null)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        setError('Failed to load appointment history. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    },
    [getToken, userId, clientId]
  )

  useEffect(() => {
    if (userId && clientId) {
      fetchAppointments(page, rowsPerPage)
    }
  }, [fetchAppointments, userId, clientId, page, rowsPerPage])

  const debouncedHandlePageChange = useCallback(
    debounce((event, value) => {
      setPage(value)
    }, 300),
    []
  )

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)

    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  return (
    <Card>
      <CardHeader title='Appointment History' />
      <CardContent>
        {error ? (
          <Typography color='error'>{error}</Typography>
        ) : (
          <>
            {isLoading && appointments.length === 0 ? (
              <Box>
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} variant='rectangular' height={60} sx={{ my: 1 }} />
                ))}
              </Box>
            ) : (
              <AppointmentList appointments={appointments} isHistory={true} />
            )}
            <Box display='flex' justifyContent='center' mt={2}>
              <TablePagination
                component='div'
                count={totalCount}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default AppointmentHistory
