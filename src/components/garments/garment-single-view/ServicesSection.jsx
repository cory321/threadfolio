import { Card, CardContent, Typography, Box, Button, Grid, LinearProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import ServiceItem from '@/components/garments/ServiceItem'

const ServicesSection = ({
  garment,
  serviceStatuses,
  handleStatusChange,
  handleServiceDeleted,
  handleServiceUpdated,
  setServiceDialogOpen,
  isAddingService,
  completedServices,
  totalServices,
  progressPercentage
}) => {
  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography variant='h5' gutterBottom>
              Services Requested
            </Typography>
            {garment.services && garment.services.length > 0 && (
              <Typography variant='body2' color='textSecondary'>
                {`${completedServices}/${totalServices} Services Completed`}
              </Typography>
            )}
          </Box>
          <Button
            variant='outlined'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => setServiceDialogOpen(true)}
            disabled={isAddingService}
          >
            {isAddingService ? 'Adding Service...' : 'Add Service'}
          </Button>
        </Box>
        {garment.services && garment.services.length > 0 ? (
          <>
            <LinearProgress
              variant='determinate'
              value={progressPercentage}
              sx={{ mt: 2, mb: 3, height: 10, borderRadius: 5 }}
            />
            <Grid container spacing={2}>
              {garment.services.map(service => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  isDone={serviceStatuses[service.id]}
                  handleStatusChange={handleStatusChange}
                  onServiceDeleted={handleServiceDeleted}
                  onServiceUpdated={handleServiceUpdated}
                  garmentName={garment.name}
                />
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant='body1' color='textSecondary' sx={{ mt: 2 }}>
            This garment has no services attached to it.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ServicesSection
