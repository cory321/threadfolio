// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Component Imports
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import EditClientForm from '@/components/clients/EditClientForm'

// Custom Components
import CustomAvatar from '@core/components/mui/Avatar'
import InitialsAvatar from '@/components/InitialsAvatar'

const UserDetails = ({ userData, onClientUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
  }

  const handleClientUpdate = updatedClient => {
    onClientUpdate(updatedClient)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                {userData.full_name && (
                  <InitialsAvatar fullName={userData.full_name} sx={{ width: 120, height: 120, fontSize: 48 }} />
                )}
                <Typography variant='h3'>{userData.full_name}</Typography>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {/* Stats Cards */}
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-t-shirt-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>25</Typography>
                  <Typography>Garments Serviced</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-file-list-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>3</Typography>
                  <Typography>Invoices Completed</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-shopping-bag-3-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>10</Typography>
                  <Typography>Orders Completed</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-money-dollar-circle-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>$500</Typography>
                  <Typography>Total</Typography>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Divider className='mlb-4' />
            <List>
              {userData.email && (
                <ListItem>
                  <ListItemIcon>
                    <i className='ri-mail-line' />
                  </ListItemIcon>
                  <ListItemText primary={userData.email} />
                </ListItem>
              )}
              {userData.phone_number && (
                <ListItem>
                  <ListItemIcon>
                    <i className='ri-phone-line' />
                  </ListItemIcon>
                  <ListItemText primary={formatPhoneNumber(userData.phone_number)} />
                </ListItem>
              )}
              {userData.mailing_address && (
                <ListItem>
                  <ListItemIcon>
                    <i className='ri-map-pin-line' />
                  </ListItemIcon>
                  <ListItemText primary={userData.mailing_address} />
                </ListItem>
              )}
              {userData.notes && (
                <ListItem>
                  <ListItemIcon>
                    <i className='ri-sticky-note-line' />
                  </ListItemIcon>
                  <ListItemText primary='Private Notes' secondary={userData.notes} />
                </ListItem>
              )}
            </List>
          </div>
          <Box display='flex' justifyContent='center'>
            <Button variant='outlined' color='primary' onClick={handleEditButtonClick}>
              Edit Client Information
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Client Information Dialog */}
      <Dialog open={isEditModalOpen} onClose={handleCloseModal} maxWidth='sm' fullWidth fullScreen={isMobile}>
        <DialogTitle>
          Edit Client Information
          <IconButton
            aria-label='close'
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditClientForm client={userData} onUpdate={handleClientUpdate} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserDetails
