import { Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import { format } from 'date-fns'

const GarmentDates = ({ garment }) => {
  return (
    <>
      <Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 1 }}>
        <AccessTimeIcon color='action' />
        <Typography variant='body1'>
          <strong>Due Date:</strong> {garment.due_date ? format(new Date(garment.due_date), 'PPP') : 'Not set'}
        </Typography>
      </Stack>
      {garment.is_event && garment.event_date && (
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 1 }}>
          <EventIcon color='action' />
          <Typography variant='body1'>
            <strong>Event Date:</strong> {format(new Date(garment.event_date), 'PPP')}
          </Typography>
        </Stack>
      )}
    </>
  )
}

export default GarmentDates
