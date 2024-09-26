import { useState } from 'react'

import { useTheme } from '@mui/material/styles'
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
  AccordionDetails
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import { format } from 'date-fns'

import ServiceTodoList from '@/components/garments/ServiceTodoList'

export default function ServiceItem({ service, isDone, handleStatusChange }) {
  const theme = useTheme()

  // State for accordion expansion
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)
  const [initialExpansionSet, setInitialExpansionSet] = useState(false)

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
            label='Done'
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
            {/* Buttons on the left, side by side */}
            <Grid item xs={12} sm={6}>
              <Stack direction='row' spacing={2}>
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
                >
                  <CancelIcon sx={{ mr: 1, fontSize: '1.25rem', color: theme.palette.text.secondary }} />
                  <Typography variant='body2' color='text.secondary'>
                    Cancel Service
                  </Typography>
                </ButtonBase>
              </Stack>
            </Grid>

            {/* Quantity and Price on the right */}
            <Grid item xs={12} sm={6}>
              <Box textAlign={{ xs: 'left', sm: 'right' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Service Subtotal
                </Typography>
                <Typography variant='h6'>
                  {service.qty} {service.unit} x ${parseFloat(service.unit_price).toFixed(2)} ={' '}
                  <Box
                    component='span'
                    sx={{
                      border: '1px solid',
                      borderColor: 'text.secondary',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      display: 'inline-block'
                    }}
                  >
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </Box>
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
      </Card>
    </Grid>
  )
}
