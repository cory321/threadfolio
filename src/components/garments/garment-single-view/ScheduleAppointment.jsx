import { useState } from 'react'

import { Card, CardHeader, CardContent, Button } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import AddAppointmentModal from '@/views/apps/calendar/AddAppointmentModal'

const ScheduleAppointment = ({ client }) => {
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)

  const handleOpenAddAppointmentModal = () => setIsAddAppointmentModalOpen(true)
  const handleCloseAddAppointmentModal = () => setIsAddAppointmentModalOpen(false)

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardHeader title='Schedule Appointment' />
        <CardContent>
          <Button
            variant='outlined'
            color='primary'
            onClick={handleOpenAddAppointmentModal}
            startIcon={<CalendarMonthIcon />}
          >
            Schedule Appointment
          </Button>
        </CardContent>
      </Card>

      {/* AddAppointmentModal */}
      <AddAppointmentModal
        addEventModalOpen={isAddAppointmentModalOpen}
        handleAddEventModalToggle={handleCloseAddAppointmentModal}
        client={client}
      />
    </>
  )
}

export default ScheduleAppointment
