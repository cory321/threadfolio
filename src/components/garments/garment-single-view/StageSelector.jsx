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

import { getContrastText } from '@/utils/colorUtils'

const StageSelector = ({ garment, stages, handleStageChange, isStageChanging, currentStage }) => {
  const stageColor = currentStage?.color || 'grey.300'
  const textColor = getContrastText(stageColor)

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            backgroundColor: stageColor,
            color: textColor,
            padding: 2,
            borderRadius: 1,
            mb: 6,
            textAlign: 'center'
          }}
        >
          <Typography variant='h6'>{garment.stage_name || 'Stage Not Set'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id='stage-select-label'>Garment Stage</InputLabel>
            <Select
              labelId='stage-select-label'
              value={garment.stage_id || ''}
              label='Select Stage'
              onChange={handleStageChange}
              disabled={isStageChanging}
            >
              {stages.map(stage => (
                <MenuItem key={stage.id} value={stage.id}>
                  {stage.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {isStageChanging && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StageSelector
