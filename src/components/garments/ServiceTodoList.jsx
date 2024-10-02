'use client'

import React, { useCallback, useState, useEffect } from 'react'

import { useAuth } from '@clerk/nextjs'
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Checkbox,
  CircularProgress,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { WarningAmberRounded } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close' // Add this import

import {
  getServiceTodos,
  addServiceTodo,
  editServiceTodo,
  deleteServiceTodo,
  toggleCompleteServiceTodo
} from '@/app/actions/serviceTodos'

export default function ServiceTodoList({ serviceId, onTasksLoaded }) {
  const { userId } = useAuth()
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingTodoTitle, setEditingTodoTitle] = useState('')
  const [error, setError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const [isAddingTodo, setIsAddingTodo] = useState(false)

  // Utility function to update task counts
  const updateTaskCounts = useCallback(() => {
    if (onTasksLoaded) {
      const totalTasks = todos.length
      const completedTasks = todos.filter(todo => todo.completed).length

      onTasksLoaded(totalTasks, completedTasks)
    }
  }, [onTasksLoaded, todos])

  useEffect(() => {
    let isMounted = true

    async function fetchTodos() {
      try {
        const fetchedTodos = await getServiceTodos(userId, serviceId)

        if (isMounted) {
          setTodos(fetchedTodos)
          updateTaskCounts() // Update task counts after fetching
        }
      } catch (e) {
        setError('Failed to load tasks.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchTodos()

    return () => {
      isMounted = false
    }
  }, [userId, serviceId, updateTaskCounts])

  // Update task counts whenever todos change
  useEffect(() => {
    updateTaskCounts()
  }, [todos, updateTaskCounts])

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === '') return

    setIsAddingTodo(true)

    try {
      const todo = await addServiceTodo(userId, serviceId, newTodoTitle.trim())

      setTodos([...todos, todo])
      setNewTodoTitle('')
      updateTaskCounts() // Update the task counts
    } catch (e) {
      setError('Failed to add task.')
    } finally {
      setIsAddingTodo(false)
    }
  }

  const handleEditInit = todo => {
    setEditingTodoId(todo.id)
    setEditingTodoTitle(todo.title)
  }

  const handleEditTodo = async id => {
    if (editingTodoTitle.trim() === '') return

    try {
      const updatedTodo = await editServiceTodo(userId, id, editingTodoTitle.trim())

      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)))
      setEditingTodoId(null)
      setEditingTodoTitle('')
    } catch (e) {
      setError('Failed to edit task.')
    }
  }

  const handleDeleteClick = id => {
    setTodoToDelete(id)
    setConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteServiceTodo(userId, todoToDelete)
      setTodos(todos.filter(todo => todo.id !== todoToDelete))
      setConfirmOpen(false)
      setTodoToDelete(null)
      updateTaskCounts() // Update the task counts
    } catch (e) {
      setError('Failed to delete task.')
    }
  }

  const handleToggleComplete = async id => {
    // Optimistic update
    const todoIndex = todos.findIndex(todo => todo.id === id)
    const updatedTodos = [...todos]

    updatedTodos[todoIndex] = {
      ...updatedTodos[todoIndex],
      completed: !updatedTodos[todoIndex].completed
    }
    const previousTodos = todos

    setTodos(updatedTodos)
    updateTaskCounts() // Update the task counts

    try {
      await toggleCompleteServiceTodo(userId, id)
    } catch (e) {
      setError('Failed to update task status.')
      setTodos(previousTodos) // Revert the optimistic update
      updateTaskCounts() // Update the task counts after reverting
    }
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Box>
      {error && (
        <Alert severity='error' onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display='flex' alignItems='center' mb={2}>
        <TextField
          fullWidth
          size='small'
          variant='outlined'
          placeholder='Add a new task...'
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleAddTodo()
            }
          }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddTodo}
          disabled={newTodoTitle.trim() === '' || isAddingTodo}
          startIcon={isAddingTodo ? <CircularProgress size={20} /> : <AddIcon />}
          sx={{ ml: 2, whiteSpace: 'nowrap' }}
        >
          {isAddingTodo ? 'Adding' : 'Add Task'}
        </Button>
      </Box>

      {todos.length > 0 ? (
        <List>
          {todos.map(todo => (
            <ListItem key={todo.id} disablePadding>
              <ListItemIcon>
                <Checkbox edge='start' checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} />
              </ListItemIcon>
              {editingTodoId === todo.id ? (
                <TextField
                  value={editingTodoTitle}
                  onChange={e => setEditingTodoTitle(e.target.value)}
                  onBlur={() => handleEditTodo(todo.id)}
                  autoFocus
                  fullWidth
                />
              ) : (
                <ListItemText
                  primary={todo.title}
                  onClick={() => handleEditInit(todo)}
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                />
              )}
              <ListItemSecondaryAction>
                <IconButton edge='end' onClick={() => handleDeleteClick(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box textAlign='center' py={5}>
          <ChecklistIcon fontSize='large' color='action' />
          <Typography variant='h6' color='textSecondary'>
            No tasks yet
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Start by adding tasks to this service.
          </Typography>
        </Box>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400 // Adjust this value as needed
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Delete Task?
          <IconButton
            aria-label='close'
            onClick={() => setConfirmOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <WarningAmberRounded sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <DialogContentText>Deleting this task cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setConfirmOpen(false)} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='primary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
