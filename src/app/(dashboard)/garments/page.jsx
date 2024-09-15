'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { compareAsc } from 'date-fns'

import { useAuth } from '@clerk/nextjs'
import { Button, Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material'

import { getGarmentsAndStages, initializeDefaultStages, getStages } from '@/app/actions/garments'
import GarmentCard from '@/components/garments/GarmentCard'
import CustomizeStagesDialog from '@/components/garments/CustomizeStagesDialog'

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
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {/* "All" Chip */}
        <Chip
          key='all'
          label='All'
          color={!selectedStage ? 'primary' : 'default'}
          onClick={() => setSelectedStage(null)}
        />

        {/* Existing Stage Chips */}
        {stages.map(stage => (
          <Chip
            key={stage.id}
            label={stage.name}
            color={selectedStage?.id === stage.id ? 'primary' : 'default'}
            onClick={() => setSelectedStage(stage)}
          />
        ))}

        <Button variant='outlined' onClick={() => setCustomizeDialogOpen(true)}>
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
