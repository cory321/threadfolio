import { useState } from 'react'

import {
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography
} from '@mui/material'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import { getContrastText } from '@/utils/colorUtils'
import { updateGarmentStage } from '@/app/actions/garments'

const StageSelector = ({ garment, setGarment, stages }) => {
  const { userId, getToken } = useAuth()
  const [isStageChanging, setIsStageChanging] = useState(false)

  const handleStageChange = async event => {
    const newStageId = event.target.value
    const newStage = stages.find(stage => stage.id === newStageId)
    const newStageName = newStage?.name || 'Unknown'
    const oldStageId = garment.stage_id
    const oldStageName = garment.stage_name

    // Optimistic update
    setGarment(prevGarment => ({
      ...prevGarment,
      stage_id: newStageId,
      stage_name: newStageName
    }))

    setIsStageChanging(true)

    try {
      const token = await getToken({ template: 'supabase' })

      if (!token) throw new Error('Failed to retrieve token')

      // Perform the actual update
      await updateGarmentStage(userId, garment.id, newStageId, token)

      // If successful, show a success message
      toast.success(`Garment stage set to ${newStageName}`)
    } catch (error) {
      console.error('Failed to update garment stage:', error)

      // If the update fails, revert the optimistic update
      setGarment(prevGarment => ({
        ...prevGarment,
        stage_id: oldStageId,
        stage_name: oldStageName
      }))

      toast.error('Failed to update garment stage. Please try again later.')
    } finally {
      setIsStageChanging(false)
    }
  }

  const currentStage = stages.find(stage => stage.name === garment?.stage_name)
  const stageColor = currentStage?.color || 'grey.300'
  const textColor = getContrastText(stageColor)

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            p: 2,
            bgcolor: stageColor,
            color: textColor,
            borderRadius: 1,
            textAlign: 'center',
            mb: 2
          }}
        >
          <Typography variant='h6'>Current Stage: {currentStage?.name || 'Unknown'}</Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel id='stage-select-label'>Update Stage</InputLabel>
          <Select
            labelId='stage-select-label'
            value={garment.stage_id || ''}
            label='Update Stage'
            onChange={handleStageChange}
          >
            {stages.map(stage => (
              <MenuItem key={stage.id} value={stage.id}>
                {stage.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isStageChanging && <CircularProgress size={24} sx={{ mt: 2 }} />}
      </CardContent>
    </Card>
  )
}

export default StageSelector
