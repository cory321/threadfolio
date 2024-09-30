import { Card, CardHeader, CardContent, Button } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

const ScheduleAppointment = ({ handleOpenAddAppointmentModal }) => {
  return (
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
  )
}

export default ScheduleAppointment
