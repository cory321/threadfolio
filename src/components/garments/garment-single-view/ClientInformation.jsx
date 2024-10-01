import { useState } from 'react'

import { Card, CardContent, Typography, Stack, Button } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'

const ClientInformation = ({ client }) => {
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)

  const handleOpenAddAppointmentModal = () => setIsAddAppointmentModalOpen(true)
  const handleCloseAddAppointmentModal = () => setIsAddAppointmentModalOpen(false)

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          Client Information
        </Typography>

        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
          <PersonIcon color='action' />
          <Typography variant='body1'>{client.full_name}</Typography>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
          <EmailIcon color='action' />
          <Typography variant='body1'>{client.email}</Typography>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
          <PhoneIcon color='action' />
          <Typography variant='body1'>{formatPhoneNumber(client.phone_number)}</Typography>
        </Stack>
        <Button
          variant='outlined'
          color='primary'
          onClick={handleOpenAddAppointmentModal}
          startIcon={<CalendarMonthIcon />}
          fullWidth
        >
          Schedule Appointment
        </Button>
      </CardContent>

      {/* AddAppointmentModal */}
      <AddAppointmentModal
        addEventModalOpen={isAddAppointmentModalOpen}
        handleAddEventModalToggle={handleCloseAddAppointmentModal}
        client={client}
      />
    </Card>
  )
}

export default ClientInformation
