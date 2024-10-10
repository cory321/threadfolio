import useSWR from 'swr'

import { Card, Typography, Box, Avatar, Skeleton, Grid } from '@mui/material'
import CheckroomIcon from '@mui/icons-material/Checkroom'

import GarmentCard from '@/components/garments/GarmentCard'
import { getPrioritizedGarments } from '@/app/actions/garmentServices'

const fetcher = () => getPrioritizedGarments()

export default function GarmentPriority() {
  const { data: garments, error } = useSWR('getPrioritizedGarments', fetcher)

  if (error) {
    return <Typography>Failed to load garments.</Typography>
  }

  if (!garments) {
    return (
      <Box>
        <Box display='flex' alignItems='center' mb={2}>
          <Avatar sx={{ mr: 1 }}>
            <CheckroomIcon />
          </Avatar>
          <Typography variant='h6'>High Priority Garments</Typography>
        </Box>
        <Box>
          {[...Array(3)].map((_, index) => (
            <Box key={index} mb={2}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 1
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Skeleton variant='rectangular' width='100%' height={0} sx={{ paddingBottom: '100%' }} />
                  </Grid>
                  <Grid item xs={8}>
                    <Skeleton variant='text' width='80%' />
                    <Skeleton variant='text' width='60%' />
                    <Skeleton variant='text' width='40%' />
                  </Grid>
                </Grid>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  if (garments.length === 0) {
    return (
      <Box>
        <Box display='flex' alignItems='center' mb={2}>
          <Typography variant='h6'>High Priority Garments</Typography>
        </Box>
        <Box textAlign='center' py={5}>
          <CheckroomIcon fontSize='large' color='action' />
          <Typography variant='h6' color='textSecondary'>
            No garments are in the queue
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Start by creating a new order
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={2}>
        <Avatar sx={{ mr: 1 }}>
          <CheckroomIcon />
        </Avatar>
        <Typography variant='h6'>High Priority Garments</Typography>
      </Box>
      <Box>
        {garments.map(garment => (
          <Box key={garment.id} mb={2}>
            <GarmentCard
              garment={garment}
              orderId={garment.order_id}
              stageColor={garment.stage_color}
              from='dashboard'
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
