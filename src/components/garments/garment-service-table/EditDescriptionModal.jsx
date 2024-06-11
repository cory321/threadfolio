import React, { useState, useEffect } from 'react'

import { Modal, Box, Typography, TextField, Button } from '@mui/material'

const EditDescriptionModal = ({ open, onClose, description, onSave }) => {
  const [newDescription, setNewDescription] = useState(description || '')

  useEffect(() => {
    setNewDescription(description || '')
  }, [description])

  const handleSave = () => {
    onSave(newDescription)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, maxWidth: 400, mx: 'auto', mt: '10%' }}
      >
        <Typography variant='h6' component='h2'>
          Edit Description
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditDescriptionModal
