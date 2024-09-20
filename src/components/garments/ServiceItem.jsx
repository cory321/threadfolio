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
  AccordionDetails,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import ServiceTodoList from '@/components/garments/ServiceTodoList'

export default function ServiceItem({ service, isDone, handleStatusChange }) {
  const theme = useTheme()

  // State for accordion expansion
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)

  // Function to handle task loading
  const handleTasksLoaded = hasTasks => {
    if (hasTasks) {
      setIsAccordionExpanded(true)
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
          {service.description && (
            <Typography variant='body2' color='textSecondary' gutterBottom>
              {service.description}
            </Typography>
          )}
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant='body2'>
                  <strong>Quantity:</strong> {service.qty} {service.unit}
                </Typography>
                <Typography variant='body2'>
                  <strong>Price:</strong> ${parseFloat(service.unit_price).toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <ButtonBase
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
                      '& .MuiTypography-root': { color: theme.palette.primary.main }
                    }
                  }}
                >
                  <AccessTimeIcon sx={{ mb: 0.5, fontSize: '2rem', color: theme.palette.text.secondary }} />
                  <Typography variant='caption' color='text.secondary'>
                    Track Time
                  </Typography>
                </ButtonBase>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        {/* Collapsible ServiceTodoList */}
        <Accordion expanded={isAccordionExpanded} onChange={(e, expanded) => setIsAccordionExpanded(expanded)}>
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
