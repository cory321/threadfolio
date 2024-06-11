import React from 'react'

import PropTypes from 'prop-types'
import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import InfoIcon from '@mui/icons-material/Info'

function EnhancedTableToolbar(props) {
  const { numSelected, onDelete } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
          Services
          <Tooltip title='Modifying this table won&rsquo;t affect the original service catalog.' placement='right'>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default EnhancedTableToolbar
