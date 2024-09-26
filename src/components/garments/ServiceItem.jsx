import { useState } from 'react'

import { useTheme } from '@mui/material/styles'
import { useAuth } from '@clerk/nextjs'
import {
  Grid,
  Card,
  CardContent,
  Checkbox,
  Typography,
  FormControlLabel,
  Stack,
  ButtonBase,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

import { deleteGarmentService } from '@/app/actions/garments'
import ServiceTodoList from '@/components/garments/ServiceTodoList'

export default function ServiceItem({
  service,
  isDone,
  handleStatusChange,
  onServiceDeleted,
  garmentName = 'Garment'
}) {
  const { userId, getToken } = useAuth()
  const theme = useTheme()

  // State for accordion expansion
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)
  const [initialExpansionSet, setInitialExpansionSet] = useState(false)

  // State for the confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // Add loading state

  // Function to handle task loading
  const handleTasksLoaded = hasTasks => {
    if (hasTasks && !initialExpansionSet) {
      setIsAccordionExpanded(true)
      setInitialExpansionSet(true) // Prevent future automatic expansions
    }
  }

  // Allow user to toggle the accordion
  const handleAccordionChange = (event, isExpanded) => {
    setIsAccordionExpanded(isExpanded)
  }

  // Format the created_at date
  const formattedDate = service.created_at ? format(new Date(service.created_at), 'EEEE, MMMM d, yyyy') : ''

  // Calculate total price
  const totalPrice = service.qty * parseFloat(service.unit_price)

  // Define colors for PAID and UNPAID status
  const paidColor = '#C5F799'
  const paidTextColor = '#293320'
  const unpaidColor = '#FDDF92'
  const unpaidTextColor = '#66593b'

  // Function to open the confirmation dialog
  const handleRemoveService = () => {
    setIsConfirmDialogOpen(true)
  }

  // Function to remove the service
  const removeService = async serviceId => {
    const token = await getToken({ template: 'supabase' })

    try {
      await deleteGarmentService(userId, serviceId, token)

      // Optionally update your state or give feedback to the user here
      if (onServiceDeleted) {
        onServiceDeleted(serviceId)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error // Rethrow to handle in handleConfirmRemove
    }
  }

  // Function to handle confirmation
  const handleConfirmRemove = async () => {
    setIsDeleting(true)

    try {
      await removeService(service.id)
      setIsConfirmDialogOpen(false)
      toast.success(`${service.name} has been removed from ${garmentName}`)
    } catch (error) {
      toast.error(`Error removing ${service.name} from ${garmentName}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Function to handle cancellation
  const handleCancelRemove = () => {
    setIsConfirmDialogOpen(false)
  }

  return (
    <Grid item xs={12}>
      <Card
        variant='outlined'
        sx={{
          position: 'relative',
          border: '2px solid',
          borderColor: isDone ? 'success.main' : 'inherit',
          transition: 'border-color 0.3s'
        }}
      >
        {isDone && (
          <Chip
            label='Service Complete'
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: '#c5f799',
              color: 'black'
            }}
          />
        )}

        <CardContent>
          <FormControlLabel
            control={
              <Checkbox
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<TaskAltIcon />}
                checked={isDone}
                onChange={() => handleStatusChange(service.id)}
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'success.main'
                  }
                }}
              />
            }
            label={<Typography variant='h5'>{service.name}</Typography>}
            sx={{
              mb: 1,
              display: 'inline-flex',
              padding: '8px',
              borderRadius: '4px',
              '& .MuiTypography-root': {
                color: isDone ? 'text.primary' : 'primary.main',
                transition: 'text-decoration 0.3s'
              },
              '&:hover .MuiTypography-root': {
                textDecoration: 'underline'
              }
            }}
          />

          {/* Conditionally display the formatted date */}
          {formattedDate && (
            <Typography variant='body2' color='textSecondary' gutterBottom>
              Requested on {formattedDate}
            </Typography>
          )}

          {service.description && (
            <Typography variant='body2' color='textSecondary' gutterBottom>
              {service.description}
            </Typography>
          )}

          <Grid container spacing={2} alignItems='center'>
            {/* Buttons on the left */}
            <Grid item xs={12} sm={6}>
              <Stack direction='column' spacing={1}>
                {/* Edit Service Button (remains unchanged) */}
                <ButtonBase
                  sx={{
                    justifyContent: 'flex-start',
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
                      '& .MuiTypography-root': { color: theme.palette.primary.main }
                    }
                  }}
                >
                  <EditIcon sx={{ mr: 1, fontSize: '1.25rem', color: theme.palette.text.secondary }} />
                  <Typography variant='body2' color='text.secondary'>
                    Edit Service
                  </Typography>
                </ButtonBase>

                {/* Conditionally Render Remove Service Button */}
                {!isDone && !service.is_paid && (
                  <ButtonBase
                    sx={{
                      justifyContent: 'flex-start',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        '& .MuiSvgIcon-root': { color: theme.palette.error.main },
                        '& .MuiTypography-root': { color: theme.palette.error.main }
                      }
                    }}
                    onClick={handleRemoveService}
                  >
                    <CancelIcon sx={{ mr: 1, fontSize: '1.25rem', color: theme.palette.text.secondary }} />
                    <Typography variant='body2' color='text.secondary'>
                      Remove Service
                    </Typography>
                  </ButtonBase>
                )}
              </Stack>
            </Grid>

            {/* Quantity and Price on the right */}
            <Grid item xs={12} sm={6}>
              <Box textAlign={{ xs: 'left', sm: 'right' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Service Subtotal
                </Typography>
                <Typography variant='h6' component='div' sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  {service.qty} {service.unit} x ${parseFloat(service.unit_price).toFixed(2)} ={' '}
                  <Box
                    component='span'
                    sx={{
                      border: '1px solid',
                      borderColor: service.is_paid ? paidColor : unpaidColor,
                      borderRadius: '4px',
                      padding: '2px 6px',
                      display: 'inline-block',
                      ml: 1
                    }}
                  >
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </Box>
                  {/* Display the PAID/UNPAID chip */}
                  <Chip
                    label={service.is_paid ? 'PAID' : 'NOT PAID'}
                    sx={{
                      ml: 1,
                      bgcolor: service.is_paid ? paidColor : unpaidColor,
                      color: service.is_paid ? paidTextColor : unpaidTextColor,
                      fontWeight: 'bold'
                    }}
                    size='small'
                  />
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        {/* Collapsible ServiceTodoList */}
        <Accordion expanded={isAccordionExpanded} onChange={handleAccordionChange}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='subtitle1'>Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ServiceTodoList serviceId={service.id} onTasksLoaded={handleTasksLoaded} />
          </AccordionDetails>
        </Accordion>

        {/* Confirmation Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={handleCancelRemove}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: 400 // Adjust as needed
            }
          }}
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Remove Service From Garment?
            <IconButton
              aria-label='close'
              onClick={handleCancelRemove}
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
            <DialogContentText>
              Removing this service will permanently delete its association with the garment. This operation cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button onClick={handleCancelRemove} variant='outlined'>
              Go Back
            </Button>
            <Button onClick={handleConfirmRemove} color='error' variant='contained' disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={24} color='inherit' /> : 'Remove Service'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Grid>
  )
}
