// src/components/garments/CustomizeStagesDialog.jsx
import React, { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useAuth } from '@clerk/nextjs'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { getStages, updateStages } from '@/app/actions/garments'

export default function CustomizeStagesDialog({ open, onClose, onStagesUpdated }) {
  const { userId, getToken } = useAuth()
  const [stages, setStages] = useState([])
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
      id: null, // Assign null; we'll get an ID upon saving to the database
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Customize Stages</DialogTitle>
      <DialogContent
        sx={{
          padding: 2,

          // Prevent DialogContent from being scrollable
          maxHeight: '60vh',
          overflow: 'visible'
        }}
      >
        <TextField
          label='New Stage Name'
          fullWidth
          value={newStageName}
          onChange={e => setNewStageName(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') handleAddStage()
          }}
        />
        <Button onClick={handleAddStage} sx={{ mt: 1 }}>
          Add Stage
        </Button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='stages'>
            {provided => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                // Ensure List does not have its own scroll
                sx={{ maxHeight: '40vh', overflow: 'auto' }}
              >
                {stages.map((stage, index) => (
                  <Draggable key={stage.id || `temp-${index}`} draggableId={stage.id || `temp-${index}`} index={index}>
                    {provided => (
                      <ListItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ListItemText primary={stage.name} />
                        <ListItemSecondaryAction>
                          <IconButton edge='end' onClick={() => handleDeleteStage(index)}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant='contained'>
          Save Stages
        </Button>
      </DialogActions>
    </Dialog>
  )
}
