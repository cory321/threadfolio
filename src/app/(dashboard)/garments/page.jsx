'use client'

import React, { useEffect, useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Button, Box, Typography, CircularProgress, Grid } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

import { getGarmentsAndStages } from '@/app/actions/garments'
import GarmentCard from '@/components/garments/GarmentCard'
import CustomizeStagesDialog from '@/components/garments/CustomizeStagesDialog'
import StageBox from '@/components/garments/StageBox'

export default function GarmentsPage() {
  const [garmentsData, setGarmentsData] = useState([])
  const [stages, setStages] = useState([])
  const [selectedStage, setSelectedStage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false)
  const { userId, getToken } = useAuth()

  const fetchGarmentsData = async () => {
    try {
      setIsLoading(true)
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      const { garments, stages: fetchedStages } = await getGarmentsAndStages(userId, token)

      console.log('Fetched garments:', garments)
      console.log('Fetched stages:', fetchedStages)

      setGarmentsData(garments)
      setStages(fetchedStages)
    } catch (error) {
      console.error('Failed to fetch garments data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchGarmentsData()
    }
  }, [userId])

  const handleStagesUpdated = () => {
    console.log('handleStagesUpdated called')
    fetchGarmentsData()
  }

  const filteredGarments = React.useMemo(() => {
    if (selectedStage) {
      return garmentsData.filter(garment => garment.stage_id === selectedStage.id)
    }

    return garmentsData
  }, [garmentsData, selectedStage])

  return (
    <Box sx={{ p: 3 }}>
      {/* Stage Pipeline */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          overflowX: 'auto',
          pb: 4 // Add padding at the bottom
        }}
      >
        {/* "View All" Stage */}
        <StageBox
          stage={{ name: 'View All' }}
          isSelected={!selectedStage}
          onClick={() => setSelectedStage(null)}
          isLast={false} // Changed to false to maintain consistent spacing
        />
        {stages.map((stage, index) => (
          <StageBox
            key={stage.id}
            stage={stage}
            isSelected={selectedStage?.id === stage.id}
            onClick={() => setSelectedStage(stage)}
            isLast={index === stages.length - 1}
          />
        ))}

        {/* Customize Stages Button */}
        <Button
          variant='outlined'
          onClick={() => setCustomizeDialogOpen(true)}
          sx={{ marginLeft: 'auto', flexShrink: 0 }}
          startIcon={<SettingsIcon />}
        >
          Customize Stages
        </Button>
      </Box>

      {/* Garments Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : filteredGarments.length === 0 ? (
        <Typography>No garments found for this stage.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredGarments.map(garment => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={garment.id}>
              <GarmentCard garment={garment} orderId={garment.order_id} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Customize Stages Dialog */}
      <CustomizeStagesDialog
        open={customizeDialogOpen}
        onClose={() => setCustomizeDialogOpen(false)}
        onStagesUpdated={handleStagesUpdated}
        stages={stages}
        userId={userId}
        getToken={getToken}
      />
    </Box>
  )
}
