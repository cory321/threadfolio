// src/components/garments/CustomizeStagesDialog.jsx
import React, { useState, useEffect } from 'react'

import { SketchPicker } from 'react-color'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Card,
  Typography,
  TextField,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Delete, DragIndicator } from '@mui/icons-material'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { updateStages } from '@/app/actions/garments'

export default function CustomizeStagesDialog({
  open,
  onClose,
  onStagesUpdated,
  stages: initialStages,
  userId,
  getToken
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [stages, setStages] = useState([])
  const [isEditing, setIsEditing] = useState(null)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [stageToDelete, setStageToDelete] = useState(null)
  const [reassignStageId, setReassignStageId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // State for Color Picker Dialog
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [colorPickerStageIndex, setColorPickerStageIndex] = useState(null)

  useEffect(() => {
    if (open) {
      // Initialize stages from props when the dialog opens
      setStages(initialStages.map(stage => ({ ...stage, touched: false })))
    }
  }, [open, initialStages])

  useEffect(() => {
    if (!open) {
      setIsEditing(null)
      setError('')
      setStageToDelete(null)
      setReassignStageId(null)
      setConfirmDeleteOpen(false)
      setDeleteError('')
    }
  }, [open])

  const handleDragEnd = result => {
    if (!result.destination) return
    const reorderedStages = Array.from(stages)
    const [removed] = reorderedStages.splice(result.source.index, 1)

    reorderedStages.splice(result.destination.index, 0, removed)
    const updatedStages = reorderedStages.map((stage, index) => ({ ...stage, position: index + 1 }))

    setStages(updatedStages)
  }

  const handleAddStage = () => {
    const newStage = {
      id: null,
      user_id: userId,
      name: '',
      position: stages.length + 1,
      touched: false,
      color: '#000000' // Default color for new stages
    }

    setStages(prevStages => {
      const updatedStages = [...prevStages, newStage]

      setIsEditing(updatedStages.length - 1) // Set the new stage to editing mode

      return updatedStages
    })

    setError('')
  }

  const handleDeleteStage = index => {
    const stageToDelete = stages[index]

    if (stageToDelete.id === null) {
      // If the stage is new (unsaved), remove it from local state
      setStages(prevStages => prevStages.filter((_, i) => i !== index))
    } else {
      // Existing stage, proceed with confirmation dialog
      setStageToDelete(stageToDelete)
      setConfirmDeleteOpen(true)
    }

    setError('')
  }

  const handleStageNameChange = (index, name) => {
    setStages(prevStages => prevStages.map((stage, i) => (i === index ? { ...stage, name, touched: true } : stage)))
  }

  const handleStageNameBlur = index => {
    setIsEditing(null)
  }

  const handleStageColorChange = (index, color) => {
    setStages(prevStages => prevStages.map((stage, i) => (i === index ? { ...stage, color } : stage)))
  }

  const handleOpenColorPicker = index => {
    setColorPickerStageIndex(index)
    setColorPickerOpen(true)
  }

  const handleCloseColorPicker = () => {
    setColorPickerStageIndex(null)
    setColorPickerOpen(false)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const token = await getToken({ template: 'supabase' })

      // Prepare stages for saving
      const stagesToSave = stages.map(stage => ({
        id: stage.id,
        user_id: userId,
        name: stage.name.trim(),
        position: stage.position,
        color: stage.color
      }))

      await updateStages(userId, stagesToSave, token)

      onStagesUpdated()
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to save stages. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseConfirmDelete = () => {
    setStageToDelete(null)
    setReassignStageId(null)
    setConfirmDeleteOpen(false)
    setDeleteError('')
  }

  const handleConfirmDelete = async () => {
    // Prevent deletion if only one stage remains
    if (stages.length <= 1) {
      setDeleteError('Cannot delete the last remaining stage.')

      return
    }

    if (stageToDelete && reassignStageId) {
      setConfirmDeleteOpen(false)
      setDeleteError('') // Clear any previous delete errors

      try {
        const token = await getToken({ template: 'supabase' })

        // Prepare stages for saving, excluding the stage to delete
        const stagesToSave = stages
          .filter(stage => stage.id !== stageToDelete.id)
          .map(stage => ({
            id: stage.id,
            user_id: userId,
            name: stage.name.trim(),
            position: stage.position,
            color: stage.color
          }))

        await updateStages(userId, stagesToSave, token, stageToDelete.id, reassignStageId)

        onStagesUpdated()
        onClose()

        // Reset variables
        setStageToDelete(null)
        setReassignStageId(null)
      } catch (err) {
        console.error('Error during handleConfirmDelete:', err)
        setDeleteError('Failed to delete stage. Please try again.')
      } finally {
        setIsSaving(false)
      }
    } else {
      setDeleteError('Please select a valid stage to reassign garments to.')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '90%',
          height: isMobile ? '100%' : 'auto',
          maxWidth: 'none'
        }
      }}
    >
      <DialogTitle>Customize Stages</DialogTitle>
      <DialogContent>
        {error && (
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', mb: 2, pb: 2 }}>
          {/* Add Stage Box */}
          <Card
            sx={{
              width: 180,
              height: 120,
              border: '2px dashed grey',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            onClick={handleAddStage}
          >
            <Typography variant='button'>Add Stage</Typography>
          </Card>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='stages' direction='horizontal'>
              {provided => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: isMobile ? 'wrap' : 'nowrap'
                  }}
                >
                  {stages.map((stage, index) => (
                    <Draggable
                      key={stage.id ? stage.id.toString() : `temp-${index}`}
                      draggableId={stage.id ? stage.id.toString() : `temp-${index}`}
                      index={index}
                    >
                      {provided => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            width: 180,
                            height: 120,
                            position: 'relative',
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            '&:hover .hover-actions': { opacity: 1 },
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            backgroundColor: 'white'
                          }}
                        >
                          {isEditing === index ? (
                            <TextField
                              value={stage.name}
                              onChange={e => handleStageNameChange(index, e.target.value)}
                              onBlur={() => handleStageNameBlur(index)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  handleStageNameBlur(index)
                                }
                              }}
                              autoFocus
                              inputProps={{ maxLength: 25 }}
                              variant='outlined'
                              size='small'
                              sx={{ width: '100%' }}
                              error={stage.touched && stage.name.trim() === ''}
                              helperText={stage.touched && stage.name.trim() === '' ? 'Stage name is required' : ''}
                            />
                          ) : (
                            <Tooltip title={stage.name.trim() === '' ? 'Click to edit' : stage.name}>
                              <Typography
                                variant='h6'
                                onClick={() => setIsEditing(index)}
                                sx={{
                                  textAlign: 'center',
                                  width: '100%',
                                  userSelect: 'none',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  color: stage.touched && stage.name.trim() === '' ? 'red' : 'inherit',
                                  cursor: 'pointer'
                                }}
                              >
                                {stage.name.trim() === '' ? 'Empty Stage Name' : stage.name}
                              </Typography>
                            </Tooltip>
                          )}

                          {/* Hover Actions */}
                          <Box
                            className='hover-actions'
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              bgcolor: 'rgba(0, 0, 0, 0.1)',
                              opacity: 0,
                              transition: 'opacity 0.3s',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-end',
                              padding: 0.5,
                              pointerEvents: 'none'
                            }}
                          >
                            {/* Delete Icon */}
                            <IconButton
                              size='small'
                              sx={{ color: 'red', pointerEvents: 'auto' }}
                              onClick={e => {
                                e.stopPropagation()
                                handleDeleteStage(index)
                              }}
                            >
                              <Delete fontSize='small' />
                            </IconButton>

                            {/* Color Box */}
                            <Box
                              onClick={e => {
                                e.stopPropagation()
                                handleOpenColorPicker(index)
                              }}
                              sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: stage.color || '#000',
                                border: '1px solid #fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                pointerEvents: 'auto'
                              }}
                            />

                            {/* Drag Handle */}
                            <IconButton
                              size='small'
                              {...provided.dragHandleProps}
                              sx={{ cursor: 'grab', pointerEvents: 'auto' }}
                            >
                              <DragIndicator fontSize='small' />
                            </IconButton>
                          </Box>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={stages.some(stage => stage.name.trim() === '') || isSaving}
        >
          Save
        </Button>
      </DialogActions>

      {/* Confirm Delete Dialog */}
      {confirmDeleteOpen && (
        <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the stage "{stageToDelete && stageToDelete.name}"?</Typography>
            <Typography>Please select a stage to reassign garments to before deleting:</Typography>

            {/* Display deleteError inside the Confirm Delete dialog */}
            {deleteError && (
              <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                {deleteError}
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              {stages
                .filter(stage => stage.id !== (stageToDelete && stageToDelete.id))
                .map(stage => (
                  <Button
                    key={stage.id}
                    variant={reassignStageId === stage.id ? 'contained' : 'outlined'}
                    onClick={() => setReassignStageId(stage.id)}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    {stage.name}
                  </Button>
                ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
            <Button variant='contained' color='error' onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Color Picker Dialog */}
      {colorPickerOpen && colorPickerStageIndex !== null && (
        <Dialog open={colorPickerOpen} onClose={handleCloseColorPicker}>
          <DialogTitle>Choose Stage Color</DialogTitle>
          <DialogContent>
            <SketchPicker
              color={stages[colorPickerStageIndex].color || '#000000'}
              onChangeComplete={color => handleStageColorChange(colorPickerStageIndex, color.hex)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseColorPicker}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  )
}
