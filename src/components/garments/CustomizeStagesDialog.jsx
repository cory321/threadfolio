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
  TextField
} from '@mui/material'
import { Delete, DragIndicator } from '@mui/icons-material'
import { useAuth } from '@clerk/nextjs'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { getStages, updateStages } from '@/app/actions/garments'

export default function CustomizeStagesDialog({ open, onClose, onStagesUpdated }) {
  const { userId, getToken } = useAuth()
  const [stages, setStages] = useState([])
  const [isEditing, setIsEditing] = useState(null)
  const [newStageName, setNewStageName] = useState('')

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

    // Update positions
    const updatedStages = reorderedStages.map((stage, index) => ({ ...stage, position: index + 1 }))

    setStages(updatedStages)
  }

  const handleAddStage = () => {
    if (newStageName.trim() === '') return

    const newStage = {
      id: null,
      user_id: userId,
      name: newStageName.trim(),
      position: stages.length + 1
    }

    setStages([...stages, newStage])
    setNewStageName('')
  }

  const handleDeleteStage = index => {
    const updatedStages = stages.filter((_, i) => i !== index)

    setStages(updatedStages)
  }

  const handleSave = async () => {
    const token = await getToken({ template: 'supabase' })

    await updateStages(userId, stages, token)
    onStagesUpdated(stages)
    onClose()
  }

  const handleStageNameChange = (index, newName) => {
    const updatedStages = stages.map((stage, i) => (i === index ? { ...stage, name: newName } : stage))

    setStages(updatedStages)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Customize Stages</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {/* Add Stage Box */}
          <Card
            sx={{
              minWidth: 150,
              height: 100,
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
                            minWidth: 150,
                            height: 100,
                            position: 'relative',
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            '&:hover .hover-actions': { opacity: 1 }
                          }}
                        >
                          {isEditing === stage.id ? (
                            <TextField
                              value={stage.name}
                              onChange={e => handleStageNameChange(index, e.target.value)}
                              onBlur={() => setIsEditing(null)}
                              autoFocus
                            />
                          ) : (
                            <Typography variant='h6'>{stage.name}</Typography>
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
                              padding: 1
                            }}
                          >
                            {/* Delete Icon */}
                            <IconButton size='small' sx={{ color: 'red' }} onClick={() => handleDeleteStage(index)}>
                              <Delete />
                            </IconButton>

                            {/* Drag Handle */}
                            <IconButton size='small' {...provided.dragHandleProps} sx={{ cursor: 'grab' }}>
                              <DragIndicator />
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
              autoFocus
            />
            <Button variant='contained' onClick={handleAddStage}>
              Add
            </Button>
            <Button onClick={() => setIsEditing(null)}>Cancel</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
