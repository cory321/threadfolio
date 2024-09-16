import React from 'react'

import { Box, Typography, useTheme } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { getContrastText } from '@/utils/colorUtils' // Import the utility function

const StageBox = ({ stage, isSelected, onClick, isLast }) => {
  const theme = useTheme()
  const defaultColor = theme.palette.grey[300]

  // Use the stage's color from the database or default color
  let backgroundColor = stage.color || defaultColor

  // Ensure backgroundColor starts with '#'
  if (
    typeof backgroundColor === 'string' &&
    !backgroundColor.startsWith('#') &&
    /^([0-9A-F]{6}|[0-9A-F]{3})$/i.test(backgroundColor)
  ) {
    backgroundColor = `#${backgroundColor}`
  }

  // Ensure text is readable against the background color
  const textColor = getContrastText(backgroundColor)

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
          flexDirection: 'column', // Stack items vertically
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          borderRadius: 1,

          // Increase border size when selected
          border: isSelected ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.grey[500]}`,
          padding: 2
        }}
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {stage.name}
        </Typography>
        <Typography variant='h6' sx={{ textAlign: 'center' }}>
          {stage.count}
        </Typography>
      </Box>
      {!isLast && (
        <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
          <ChevronRightIcon sx={{ color: theme.palette.grey[500], fontSize: 30 }} />
        </Box>
      )}
    </Box>
  )
}

export default StageBox
