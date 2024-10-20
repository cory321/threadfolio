import { useState } from 'react'

import {
  Card,
  CardHeader,
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
import { updateGarmentStage } from '@/app/actions/garmentStages'

const StageSelector = ({ garment, setGarment, stages, marginTop = 0 }) => {
  const { userId } = useAuth()
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
      // Perform the actual update
      await updateGarmentStage(userId, garment.id, newStageId)

      // If successful, show a success message
      toast.success(`Garment stage set to ${newStageName}`, {
        hideProgressBar: false
      })
    } catch (error) {
      console.error('Failed to update garment stage:', error)

      // If the update fails, revert the optimistic update
      setGarment(prevGarment => ({
        ...prevGarment,
        stage_id: oldStageId,
        stage_name: oldStageName
      }))

      toast.error('Failed to update garment stage. Please try again later.', {
        hideProgressBar: false
      })
    } finally {
      setIsStageChanging(false)
    }
  }

  const currentStage = stages.find(stage => stage.id === garment?.stage_id)
  const stageColor = currentStage?.color || 'grey.300'
  const textColor = getContrastText(stageColor)

  return (
    <Card sx={{ mt: marginTop }}>
      <CardHeader title='Garment Stage' />
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
          <Typography variant='h6'>{currentStage?.name || 'Unknown Stage'}</Typography>
        </Box>

        <FormControl fullWidth sx={{ position: 'relative', mt: 4 }}>
          <InputLabel id='stage-select-label'>Update Stage</InputLabel>
          <Select
            labelId='stage-select-label'
            value={garment.stage_id || ''}
            label='Update Stage'
            onChange={handleStageChange}
            disabled={isStageChanging}
          >
            {stages.map(stage => (
              <MenuItem key={stage.id} value={stage.id}>
                {stage.name}
              </MenuItem>
            ))}
          </Select>

          {isStageChanging && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: '40px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            >
              <CircularProgress size={20} />
            </Box>
          )}
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default StageSelector
