import React, { useState, useEffect, useCallback } from 'react'

import { Card, CardHeader, CardContent, Typography, Box, TablePagination, Skeleton } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import debounce from 'lodash/debounce'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

import AppointmentList from './AppointmentList'
import { getClientAppointments } from '@/app/actions/appointments'

const AppointmentHistory = ({ clientId, userId, showCancelled }) => {
  const { getToken } = useAuth()
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

        const filteredAppointments = showCancelled
          ? newAppointments
          : newAppointments.filter(app => app.extendedProps.status !== 'cancelled')

        setAppointments(filteredAppointments)
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
    const fetchAppointments = async () => {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })
        const { appointments, totalCount } = await getClientAppointments(
          userId,
          clientId,
          token,
          page + 1,
          rowsPerPage,
          true
        )

        const filteredAppointments = showCancelled
          ? appointments
          : appointments.filter(app => app.extendedProps.status !== 'cancelled')

        setAppointments(filteredAppointments)
        setTotalCount(totalCount)
        setError(null)
      } catch (error) {
        console.error('Error fetching past appointments:', error)
        setError('Failed to load past appointments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId && clientId) {
      fetchAppointments()
    }
  }, [getToken, userId, clientId, page, rowsPerPage, showCancelled])

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

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  if (appointments.length === 0) {
    return null // Don't render anything if there are no past appointments
  }

  return (
    <Card>
      <CardHeader title='Past Appointments' />
      <CardContent>
        <AppointmentList appointments={appointments} isHistory={true} />
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
      </CardContent>
    </Card>
  )
}

export default AppointmentHistory
