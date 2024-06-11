import React, { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const EditDescriptionDialog = ({ open, onClose, description, onSave }) => {
  const [newDescription, setNewDescription] = useState(description || '')

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setNewDescription(description || '')
  }, [description])

  const handleSave = () => {
    onSave(newDescription)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md' fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Description
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDescriptionDialog
