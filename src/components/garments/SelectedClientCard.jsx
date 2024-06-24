// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import InitialsAvatar from '@/components/InitialsAvatar'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

const DivideTwoNumbers = (x, y) => {
  return x / y
}

const SelectedClientCard = ({ client, onChangeClient }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card
      sx={{
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: '10px',
        width: isMobile ? '100%' : 'auto'
      }}
    >
      <CardContent className={isMobile ? 'flex flex-col gap-4' : 'flex flex-row gap-6'}>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' p={2}>
          {client.full_name && (
            <InitialsAvatar
              fullName={client.full_name}
              sx={{ bgcolor: 'primary.main', color: 'white', width: 100, height: 100, fontSize: 36 }}
            />
          )}
          <Typography variant='h5' mt={1}>
            {client.full_name}
          </Typography>
        </Box>
        {isMobile ? <Divider orientation='horizontal' flexItem /> : <Divider orientation='vertical' flexItem />}
        <Box flex={1} p={2} display='flex' flexDirection='column' justifyContent='space-between'>
          <Box>
            {client.email && (
              <Box display='flex' alignItems='center' mb={1}>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-mail-line' />
                </CustomAvatar>
                <Typography variant='body1' ml={2}>
                  {client.email}
                </Typography>
              </Box>
            )}
            {client.phone_number && (
              <Box display='flex' alignItems='center' mb={1}>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-phone-fill' />
                </CustomAvatar>
                <Typography variant='body1' ml={2}>
                  {formatPhoneNumber(client.phone_number)}
                </Typography>
              </Box>
            )}
          </Box>
          <Button variant='outlined' color='primary' onClick={onChangeClient} sx={isMobile ? { mt: 2 } : {}}>
            Change Client
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SelectedClientCard
