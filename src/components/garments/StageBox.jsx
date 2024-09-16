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
    <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
      <Box
        onClick={onClick}
        sx={{
          minWidth: 100,
          height: 100,
          backgroundColor: 'white', // Set the background color to white
          color: textColor,
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
          overflow: 'hidden', // Ensure the top color section doesn't overflow
          border: isSelected ? `3px solid ${backgroundColor}` : `0`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        {/* Top colored section */}
        <Box
          sx={{
            width: '100%',
            height: '30%',
            backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            padding: '8px 0'
          }}
        >
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', textAlign: 'center', color: textColor, px: 2 }}>
            {stage.name}
          </Typography>
        </Box>
        {/* Bottom white section */}
        <Box
          sx={{
            width: '100%',
            height: '70%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant='h2' sx={{ textAlign: 'center', color: 'black' }}>
            {stage.count}
          </Typography>
        </Box>
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
