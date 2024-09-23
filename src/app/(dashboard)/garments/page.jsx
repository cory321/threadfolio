'use client'

import React, { useEffect, useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

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
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortField, setSortField] = useState('due_date')
  const { userId, getToken } = useAuth()

  const fetchGarmentsData = async () => {
    try {
      setIsLoading(true)
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      const { garments, stages: fetchedStages } = await getGarmentsAndStages(userId, token)

      console.log('Fetched garments:', garments)
      console.log('Fetched stages:', fetchedStages)

      setGarmentsData(
        garments.map(garment => ({
          ...garment,
          stage_name: garment.garment_stages.name,
          stage_color: garment.garment_stages.color
        }))
      )
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

  const handleStagesUpdated = async deletedStageId => {
    console.log('handleStagesUpdated called')
    await fetchGarmentsData()

    if (deletedStageId && selectedStage && selectedStage.id === deletedStageId) {
      setSelectedStage(null)
    }
  }

  // Compute counts of garments per stage
  const garmentCounts = React.useMemo(() => {
    const counts = {}

    garmentsData.forEach(garment => {
      const stageId = garment.stage_id

      counts[stageId] = (counts[stageId] || 0) + 1
    })

    return counts
  }, [garmentsData])

  const totalGarments = garmentsData.length

  const filteredGarments = React.useMemo(() => {
    let garments = garmentsData

    if (selectedStage) {
      garments = garments.filter(garment => garment.stage_id === selectedStage.id)
    }

    // Sort the garments by the selected field
    garments = garments.sort((a, b) => {
      const valueA = a[sortField] ? new Date(a[sortField]) : new Date(0)
      const valueB = b[sortField] ? new Date(b[sortField]) : new Date(0)

      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
    })

    return garments
  }, [garmentsData, selectedStage, sortOrder, sortField])

  return (
    <Box sx={{ p: 3 }}>
      {/* Stage Pipeline */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          overflowX: 'scroll',
          overflowY: 'hidden',
          pb: 4
        }}
      >
        {/* "View All" Stage */}
        <StageBox
          stage={{ name: 'View All', count: totalGarments }}
          isSelected={!selectedStage}
          onClick={() => setSelectedStage(null)}
          isLast={false}
        />
        {stages.map((stage, index) => (
          <StageBox
            key={stage.id}
            stage={{ ...stage, count: garmentCounts[stage.id] || 0 }}
            isSelected={selectedStage?.id === stage.id}
            onClick={() => setSelectedStage(stage)}
            isLast={index === stages.length - 1}
          />
        ))}
      </Box>

      {/* Sorting Options */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Sorting Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant='outlined' size='small' sx={{ mr: 2, minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortField} onChange={e => setSortField(e.target.value)} label='Sort By'>
              <MenuItem value='due_date'>Due Date</MenuItem>
              <MenuItem value='created_at'>Date Created</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
            <IconButton onClick={() => setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))}>
              {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Customize Stages Button */}
        <Button variant='outlined' onClick={() => setCustomizeDialogOpen(true)} startIcon={<SettingsIcon />}>
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
              <GarmentCard
                garment={garment}
                orderId={garment.order_id}
                stageColor={stages.find(stage => stage.id === garment.stage_id)?.color}
              />
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
