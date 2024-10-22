import { useState } from 'react'

import { useTheme } from '@mui/material/styles'
import { useAuth } from '@clerk/nextjs'
import {
  Grid,
  Card,
  CardContent,
  Typography,
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
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import EventIcon from '@mui/icons-material/Event'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import UndoIcon from '@mui/icons-material/Undo'
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

  // Function to handle confirmation
  const handleConfirmRemove = async () => {
    setIsDeleting(true)

    try {
      await deleteGarmentService(service.id)
      setIsConfirmDialogOpen(false)
      toast.success(`${service.name} has been removed from ${garmentName}`, {
        hideProgressBar: false
      })

      if (onServiceDeleted) {
        onServiceDeleted(service.id)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error(`Failed to delete service: ${error.message}`, {
        hideProgressBar: false
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Function to handle canceling the confirmation dialog
  const handleCancelRemove = () => {
    setIsConfirmDialogOpen(false)
  }

  // Function to handle removing the service
  const handleRemoveService = () => {
    setIsConfirmDialogOpen(true)
  }

  // Function to handle service editing
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
      await updateGarmentService(service.id, updatedServiceData)

      // Update parent state after successful edit
      if (onServiceUpdated) {
        onServiceUpdated(service.id, updatedServiceData)
      }

      setIsEditDialogOpen(false)
      toast.success(`${service.name} has been updated`, {
        hideProgressBar: false
      })
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error(`Failed to update service: ${error.message}`, {
        hideProgressBar: false
      })
    }
  }

  // Function to handle toggling service completion
  const handleToggleComplete = () => {
    handleStatusChange(service.id)
  }

  return (
    <Grid item xs={12}>
      <Card
        variant='outlined'
        sx={{
          position: 'relative',
          border: '2px solid',
          borderColor: isDone ? 'success.main' : 'inherit',
          transition: 'border-color 0.3s',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 200 // Adjust as needed
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* Top Section: Service Name and Chips */}
          <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
            <Typography variant='h5' className='service-name'>
              {service.name}
            </Typography>

            {/* Paid/Not Paid Chip and Completion Status Chip */}
            <Box display='flex' alignItems='center' gap={1}>
              <Chip
                label={service.is_paid ? 'PAID' : 'NOT PAID'}
                sx={{
                  bgcolor: service.is_paid ? paidColor : unpaidColor,
                  color: service.is_paid ? paidTextColor : unpaidTextColor,
                  fontWeight: 'bold',
                  borderRadius: '4px'
                }}
                size='medium'
              />

              {isDone && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label='Completed'
                  sx={{
                    bgcolor: '#E8F5E9', // Light green background
                    color: '#1B5E20', // Dark green text
                    fontWeight: 'bold',
                    borderRadius: '4px'
                  }}
                  size='medium'
                />
              )}
            </Box>
          </Box>
        </CardContent>

        {/* Spacer to push content to the top */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Action Buttons at the Bottom Right */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Stack direction='row' spacing={2}>
            {/* Edit Service Button */}
            {!isDone && !service.is_paid && (
              <ButtonBase
                sx={{
                  width: 80,
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'grey.400',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
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
                    fontSize: '2rem',
                    color: theme.palette.text.secondary
                  }}
                />
                <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
                  Edit Service
                </Typography>
              </ButtonBase>
            )}

            {/* Remove Service Button */}
            {!isDone && !service.is_paid && (
              <ButtonBase
                sx={{
                  width: 80,
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'grey.400',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'error.main',
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
                    fontSize: '2rem',
                    color: theme.palette.text.secondary
                  }}
                />
                <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
                  Remove Service
                </Typography>
              </ButtonBase>
            )}

            {/* Mark Complete / Mark Incomplete Button */}
            <ButtonBase
              sx={{
                width: 80,
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: 1,
                p: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: isDone ? 'warning.main' : 'success.main',
                  '& .MuiSvgIcon-root': {
                    color: isDone ? 'warning.main' : 'success.main'
                  },
                  '& .MuiTypography-root': {
                    color: isDone ? 'warning.main' : 'success.main'
                  }
                }
              }}
              onClick={handleToggleComplete}
            >
              {isDone ? (
                <UndoIcon
                  sx={{
                    fontSize: '2rem',
                    color: theme.palette.text.secondary
                  }}
                />
              ) : (
                <CheckCircleIcon
                  sx={{
                    fontSize: '2rem',
                    color: theme.palette.text.secondary
                  }}
                />
              )}
              <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
                {isDone ? 'Mark Incomplete' : 'Mark Complete'}
              </Typography>
            </ButtonBase>
          </Stack>
        </Box>

        {/* Description and Tasks Accordions Without Padding */}
        {/* Description Accordion */}
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

            {/* Service Subtotal in Description Area */}
            <Box mt={2}>
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
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Tasks Accordion */}
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
