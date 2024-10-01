import { useState, useEffect } from 'react'

import { Card, CardHeader, CardContent, Typography, TextField, Box, Button, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

const GarmentNotes = ({ notes, onUpdateNotes }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState(notes || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setEditedNotes(notes || '')
    }
  }, [notes, isEditing])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    setEditedNotes(notes || '')
  }

  const handleSaveClick = async () => {
    if (onUpdateNotes) {
      setIsSaving(true) // Start loading indicator

      try {
        await onUpdateNotes(editedNotes)
        setIsEditing(false)
      } finally {
        setIsSaving(false) // End loading indicator
      }
    }
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader
        title='Garment Notes'
        action={
          isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant='text'
                color='primary'
                onClick={handleSaveClick}
                disabled={isSaving || editedNotes === notes}
                startIcon={isSaving && <CircularProgress size={20} />}
              >
                Save
              </Button>
              <Button
                variant='text'
                color='secondary'
                onClick={handleCancelClick}
                disabled={isSaving}
                sx={{ minWidth: 'auto' }} // Optional: Adjust button width
              >
                <CloseIcon /> {/* Display only the icon */}
              </Button>
            </Box>
          ) : (
            <Button variant='text' color='primary' onClick={handleEditClick} startIcon={<EditIcon />}>
              Edit
            </Button>
          )
        }
      />
      <CardContent>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editedNotes}
            onChange={e => setEditedNotes(e.target.value)}
            disabled={isSaving}
          />
        ) : (
          <Typography variant='body1'>{notes || 'No notes'}</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default GarmentNotes
