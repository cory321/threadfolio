import { Card, CardContent, Typography, Stack } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

const ClientInformation = ({ client }) => {
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
        <Stack direction='row' alignItems='center' spacing={1}>
          <PhoneIcon color='action' />
          <Typography variant='body1'>{formatPhoneNumber(client.phone_number)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ClientInformation
