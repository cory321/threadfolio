// src/components/garments/CustomizeStagesDialog.jsx
import React, { useState, useEffect } from 'react'

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
  Tooltip
} from '@mui/material'
import { Delete, DragIndicator, Edit } from '@mui/icons-material'
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
  const [stages, setStages] = useState([])
  const [isEditing, setIsEditing] = useState(null)
  const [error, setError] = useState('')
  const [stageToDelete, setStageToDelete] = useState(null)
  const [reassignStageId, setReassignStageId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      // Initialize stages from props when the dialog opens
      setStages(initialStages)
    }
  }, [open, initialStages])

  useEffect(() => {
    if (!open) {
      setIsEditing(null)
      setError('')
      setStageToDelete(null)
      setReassignStageId(null)
      setConfirmDeleteOpen(false)
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
      position: stages.length + 1
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
      setStages(prevStages => {
        const updatedStages = prevStages.filter((_, i) => i !== index)

        // Update positions of remaining stages
        return updatedStages.map((stage, idx) => ({
          ...stage,
          position: idx + 1
        }))
      })
    } else {
      // Existing stage, proceed with confirmation dialog
      setStageToDelete(stageToDelete)
      setConfirmDeleteOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    // Prevent deletion if only one stage remains
    if (stages.length <= 1) {
      setError('Cannot delete the last remaining stage.')
      setConfirmDeleteOpen(false)

      return
    }

    if (stageToDelete && reassignStageId && reassignStageId !== stageToDelete.id) {
      setConfirmDeleteOpen(false)

      try {
        await handleSave()

        // Reset variables after handleSave completes
        setStageToDelete(null)
        setReassignStageId(null)
      } catch (err) {
        console.error('Error during handleSave:', err)
        setError('Failed to save stages. Please try again.')
      }
    } else {
      setError('Please select a valid stage to reassign garments to.')
    }
  }

  const handleStageNameChange = (index, newName) => {
    const updatedStages = stages.map((stage, i) => (i === index ? { ...stage, name: newName } : stage))

    setStages(updatedStages)
  }

  const handleStageNameBlur = index => {
    const updatedStages = stages.map((stage, i) =>
      i === index && stage.name.trim() === '' ? { ...stage, name: `Stage ${i + 1}` } : stage
    )

    setStages(updatedStages)
    setIsEditing(null)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const token = await getToken({ template: 'supabase' })

      await updateStages(userId, stages, token, stageToDelete, reassignStageId)

      console.log('Stages updated in database')

      onStagesUpdated()
      onClose()

      // Reset local state
      setError('')
      setStageToDelete(null)
      setReassignStageId(null)
    } catch (err) {
      console.error(err)
      setError('Failed to save stages. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Customize your stages</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' sx={{ mb: 2 }}>
          Add, rename, move, or delete stages to fit your garment flow processes.
        </Typography>
        {error && (
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {/* DragDropContext for Stages */}
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', mb: 2 }}>
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
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ display: 'flex', gap: 2 }}>
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
                            backgroundColor: stage.name.trim() === '' ? '#fff0f0' : 'white'
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
                              error={stage.name.trim() === ''}
                              helperText={stage.name.trim() === '' ? 'Stage name is required' : ''}
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
                                  color: stage.name.trim() === '' ? 'red' : 'inherit',
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

                            {/* Edit Icon */}
                            <IconButton
                              size='small'
                              sx={{ color: 'blue', pointerEvents: 'auto' }}
                              onClick={e => {
                                e.stopPropagation()
                                setIsEditing(index)
                              }}
                            >
                              <Edit fontSize='small' />
                            </IconButton>

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
        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the stage "{stageToDelete && stageToDelete.name}"?</Typography>
            <Typography>Please select a stage to reassign garments to before deleting:</Typography>
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
            <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant='contained' color='error' onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  )
}
