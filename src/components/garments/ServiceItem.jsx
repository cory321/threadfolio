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
import EventIcon from '@mui/icons-material/Event'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

import { deleteGarmentService, updateGarmentService } from '@/app/actions/garmentServices'
import ServiceTodoList from '@/components/garments/ServiceTodoList'
import EditServiceDialog from '@/components/garments/EditServiceDialog'
import { formatAsCurrency } from '@/utils/currencyUtils'
import { pluralizeUnit } from '@/utils/unitUtils'

export default function ServiceItem({
  service,
  isDone,
  handleStatusChange,
  onServiceDeleted,
  onServiceUpdated,
  garmentName = 'Garment'
}) {
  const { userId } = useAuth()
  const theme = useTheme()

  // State for accordion expansion
  const [expandedPanel, setExpandedPanel] = useState(false)

  // State for the confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // State variables for task counts
  const [totalTasks, setTotalTasks] = useState(null)
  const [completedTasks, setCompletedTasks] = useState(null)

  const handleChange = panel => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false)
  }

  // Function to handle task loading
  const handleTasksLoaded = (total, completed) => {
    setTotalTasks(total)
    setCompletedTasks(completed)
  }

  // Format the created_at date
  const formattedDate = service.created_at ? format(new Date(service.created_at), 'EEEE, MMMM d, yyyy') : ''

  // Calculate total price
  const totalPrice = service.qty * parseFloat(service.unit_price)
  const formattedTotalPrice = formatAsCurrency(totalPrice.toFixed(2))
  const formattedUnitPrice = formatAsCurrency(parseFloat(service.unit_price).toFixed(2))

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
    try {
      await deleteGarmentService(userId, serviceId)

      // Update parent state after successful deletion
      if (onServiceDeleted) {
        onServiceDeleted(serviceId)
      }

      // Remove toast notifications from here
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      setIsDeleting(false)
      setIsConfirmDialogOpen(false)
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
      toast.error(`Failed to delete service: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Function to handle cancellation
  const handleCancelRemove = () => {
    setIsConfirmDialogOpen(false)
  }

  // Function to open the edit dialog
  const handleEditService = () => {
    setIsEditDialogOpen(true)
  }

  // Function to handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
  }

  // Function to handle saving the edited service
  const handleSaveEditedService = async updatedServiceData => {
    try {
      await updateGarmentService(userId, service.id, updatedServiceData)

      // Update parent state after successful edit
      if (onServiceUpdated) {
        onServiceUpdated(service.id, updatedServiceData)
      }

      setIsEditDialogOpen(false)
      toast.success(`${service.name} has been updated`)
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error(`Failed to update service: ${error.message}`)

      // Do not update state because the operation failed
    }
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

          <Grid container spacing={2}>
            {/* Left Column: Edit and Remove Buttons */}
            <Grid item xs={12} sm={3}>
              {/* Edit and Remove Service Buttons */}
              <Stack direction='column' spacing={1}>
                {/* Conditionally Render Edit Service Button */}
                {!isDone && !service.is_paid && (
                  <ButtonBase
                    sx={{
                      justifyContent: 'flex-start',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.primary.main
                        },
                        '& .MuiTypography-root': {
                          color: theme.palette.primary.main
                        }
                      }
                    }}
                    onClick={handleEditService}
                  >
                    <EditIcon
                      sx={{
                        mr: 1,
                        fontSize: '1.25rem',
                        color: theme.palette.text.secondary
                      }}
                    />
                    <Typography variant='body2' color='text.secondary'>
                      Edit Service
                    </Typography>
                  </ButtonBase>
                )}
                {/* Conditionally Render Remove Service Button */}
                {!isDone && !service.is_paid && (
                  <ButtonBase
                    sx={{
                      justifyContent: 'flex-start',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.error.main
                        },
                        '& .MuiTypography-root': {
                          color: theme.palette.error.main
                        }
                      }
                    }}
                    onClick={handleRemoveService}
                  >
                    <CancelIcon
                      sx={{
                        mr: 1,
                        fontSize: '1.25rem',
                        color: theme.palette.text.secondary
                      }}
                    />
                    <Typography variant='body2' color='text.secondary'>
                      Remove Service
                    </Typography>
                  </ButtonBase>
                )}
              </Stack>
            </Grid>

            {/* Right Column: Service Subtotal */}
            <Grid item xs={12} sm={9}>
              <Box textAlign={{ xs: 'left', sm: 'right' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Service Subtotal
                </Typography>
                <Typography variant='h6' component='div' sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  {service.qty} {pluralizeUnit(service.unit, service.qty)} x ${formattedUnitPrice} ={' '}
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
                    <strong>${formattedTotalPrice}</strong>
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

        {/* Combined Accordion */}
        <Accordion
          expanded={expandedPanel === 'tasks'}
          onChange={handleChange('tasks')}
          disableGutters
          elevation={0}
          sx={{
            '&:before': { display: 'none' },
            borderTop: '1px solid rgba(0, 0, 0, .125)'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='subtitle1'>
              Tasks
              {totalTasks > 0 ? ` (${completedTasks}/${totalTasks})` : ''}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ServiceTodoList serviceId={service.id} onTasksLoaded={handleTasksLoaded} />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expandedPanel === 'description'}
          onChange={handleChange('description')}
          disableGutters
          elevation={0}
          sx={{
            '&:before': { display: 'none' },
            borderTop: '1px solid rgba(0, 0, 0, .125)'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='subtitle1'>Description</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {service.description && (
              <Typography variant='body2' color='textSecondary'>
                {service.description}
              </Typography>
            )}
            {formattedDate && (
              <Typography variant='body2' color='textSecondary' gutterBottom sx={{ mt: service.description ? 4 : 0 }}>
                <EventIcon fontSize='small' sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                This service was requested on {formattedDate}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Edit Service Dialog */}
        {isEditDialogOpen && (
          <EditServiceDialog
            open={isEditDialogOpen}
            onClose={handleCloseEditDialog}
            service={service}
            onSave={handleSaveEditedService}
          />
        )}

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
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <WarningAmberRounded sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
            <DialogContentText>
              Removing this service will permanently delete its association with the garment. This operation cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button onClick={handleCancelRemove} variant='outlined'>
              Go Back
            </Button>
            <Button onClick={handleConfirmRemove} color='primary' variant='contained' disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={24} color='inherit' /> : 'Remove Service'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Grid>
  )
}
