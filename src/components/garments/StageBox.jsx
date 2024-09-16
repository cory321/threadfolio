import React from 'react'

import { Box, Typography, useTheme } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const StageBox = ({ stage, isSelected, onClick, isLast }) => {
  const theme = useTheme()
  const backgroundColor = isSelected ? theme.palette.primary.main : theme.palette.grey[300]
  const textColor = theme.palette.getContrastText(backgroundColor)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        onClick={onClick}
        sx={{
          minWidth: 100,
          height: 100,
          backgroundColor,
          color: textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          borderRadius: 1,
          border: `1px solid ${theme.palette.grey[500]}`
        }}
      >
        <Typography
          variant='subtitle1'
          align='center'
          sx={{
            px: 1,
            fontWeight: 'bold'
          }}
        >
          {stage.name}
        </Typography>
      </Box>
      <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        {!isLast && <ChevronRightIcon sx={{ color: theme.palette.grey[500], fontSize: 30 }} />}
      </Box>
    </Box>
  )
}

export default StageBox
