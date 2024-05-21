// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { Avatar, Box } from '@mui/material'

// Component Imports
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { getInitials } from '@/utils/getInitials'

import EditUserInfo from '@components/dialogs/edit-user-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'

// Component definition
const UserDetails = ({ userData }) => {
  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                {userData.full_name && (
                  <Avatar sx={{ width: 120, height: 120, fontSize: 48 }}>{getInitials(userData.full_name)}</Avatar>
                )}
                <Typography variant='h3'>{userData.full_name}</Typography>
              </div>
              <Chip label='cute label if needed' color='success' size='small' variant='tonal' />
            </div>
            <Box mt={4} px={2}>
              {userData.phone_number && (
                <Box display='flex' alignItems='center' mb={2}>
                  <CustomAvatar variant='rounded' color='primary' skin='light'>
                    <i className='ri-phone-fill' />
                  </CustomAvatar>
                  <Typography variant='h5' ml={2}>
                    {formatPhoneNumber(userData.phone_number)}
                  </Typography>
                </Box>
              )}
              {userData.email && (
                <Box display='flex' alignItems='center' mb={2}>
                  <CustomAvatar variant='rounded' color='primary' skin='light'>
                    <i className='ri-mail-line' />
                  </CustomAvatar>
                  <Typography variant='h5' ml={2}>
                    {userData.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
          <div>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              {userData.mailing_address && (
                <div className='flex items-center flex-wrap gap-x-1.5'>
                  <Typography className='font-medium' color='text.primary'>
                    Mailing Address:
                  </Typography>
                  <Typography>{userData.mailing_address}</Typography>
                </div>
              )}
              {userData.notes && (
                <div className='flex items-center flex-wrap gap-x-1.5'>
                  <Typography className='font-medium' color='text.primary'>
                    Private Notes:
                  </Typography>
                  <Typography>{userData.notes}</Typography>
                </div>
              )}
            </div>
          </div>
          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'outlined')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
