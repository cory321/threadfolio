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
import { useAuth } from '@clerk/nextjs'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { getStages, updateStages } from '@/app/actions/garments'

export default function CustomizeStagesDialog({ open, onClose, onStagesUpdated }) {
  const { userId, getToken } = useAuth()
  const [stages, setStages] = useState([])
  const [isEditing, setIsEditing] = useState(null)
  const [newStageName, setNewStageName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStages() {
      const token = await getToken({ template: 'supabase' })
      const userStages = await getStages(userId, token)

      setStages(userStages)
    }

    if (open) {
      fetchStages()
    }
  }, [open, userId, getToken])

  const handleDragEnd = result => {
    if (!result.destination) return
    const reorderedStages = Array.from(stages)
    const [removed] = reorderedStages.splice(result.source.index, 1)

    reorderedStages.splice(result.destination.index, 0, removed)
    const updatedStages = reorderedStages.map((stage, index) => ({ ...stage, position: index + 1 }))

    setStages(updatedStages)
  }

  const handleAddStage = () => {
    if (newStageName.trim() === '') {
      setError('Stage name cannot be empty.')

      return
    }

    const newStage = {
      id: null,
      user_id: userId,
      name: newStageName.trim(),
      position: stages.length + 1
    }

    setStages([...stages, newStage])
    setNewStageName('')
    setIsEditing(null)
    setError('')
  }

  const handleDeleteStage = index => {
    const updatedStages = stages.filter((_, i) => i !== index)

    setStages(updatedStages)
  }

  const handleSave = async () => {
    const hasEmptyNames = stages.some(stage => stage.name.trim() === '')

    if (hasEmptyNames) {
      setError('All stage names must be filled out.')

      return
    }

    const token = await getToken({ template: 'supabase' })

    try {
      await updateStages(userId, stages, token)
      onStagesUpdated(stages)
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to save stages. Please try again.')
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
            onClick={() => setIsEditing('new')}
          >
            <Typography variant='button'>Add Stage</Typography>
          </Card>

          {/* DragDropContext for Stages */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='stages' direction='horizontal'>
              {provided => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ display: 'flex', gap: 2 }}>
                  {stages.map((stage, index) => (
                    <Draggable
                      key={stage.id || `temp-${index}`}
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
                            cursor: 'pointer',
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            backgroundColor: stage.name.trim() === '' ? '#fff0f0' : 'white'
                          }}
                        >
                          {isEditing === stage.id ? (
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
                                onClick={() => setIsEditing(stage.id)}
                                sx={{
                                  textAlign: 'center',
                                  width: '100%',
                                  userSelect: 'none',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  color: stage.name.trim() === '' ? 'red' : 'inherit'
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
                                setIsEditing(stage.id)
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

        {/* Add Stage Input */}
        {isEditing === 'new' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <TextField
              label='Stage Name'
              value={newStageName}
              onChange={e => setNewStageName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddStage()
                }
              }}
              autoFocus
              variant='outlined'
              size='small'
              fullWidth
              inputProps={{ maxLength: 25 }}
              error={newStageName.trim() === ''}
              helperText={newStageName.trim() === '' ? 'Stage name is required' : ''}
            />
            <Button variant='contained' onClick={handleAddStage} disabled={newStageName.trim() === ''}>
              Add
            </Button>
            <Button onClick={() => setIsEditing(null)}>Cancel</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='contained' onClick={handleSave} disabled={stages.some(stage => stage.name.trim() === '')}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
