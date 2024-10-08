'use client'

import React, { useState, useEffect } from 'react'

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
import CloseIcon from '@mui/icons-material/Close'

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

  useEffect(() => {
    let isMounted = true

    async function fetchTodos() {
      try {
        const fetchedTodos = await getServiceTodos(userId, serviceId)

        if (isMounted) {
          setTodos(fetchedTodos)
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
  }, [userId, serviceId])

  // Update task counts whenever todos change
  useEffect(() => {
    if (onTasksLoaded) {
      const totalTasks = todos.length
      const completedTasks = todos.filter(todo => todo.completed).length

      onTasksLoaded(totalTasks, completedTasks)
    }
  }, [todos, onTasksLoaded])

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === '') return

    setIsAddingTodo(true)

    // Optimistic update
    const tempId = Date.now().toString()

    const newTodo = {
      id: tempId,
      title: newTodoTitle.trim(),
      completed: false
    }

    setTodos([...todos, newTodo])
    setNewTodoTitle('')

    try {
      const todo = await addServiceTodo(userId, serviceId, newTodoTitle.trim())

      // Replace the temporary todo with the one from the server
      setTodos(prevTodos => prevTodos.map(t => (t.id === tempId ? todo : t)))
    } catch (e) {
      setError('Failed to add task.')

      // Revert optimistic update
      setTodos(prevTodos => prevTodos.filter(t => t.id !== tempId))
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

    // Optimistic update
    const previousTodos = [...todos]

    setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? { ...todo, title: editingTodoTitle.trim() } : todo)))
    setEditingTodoId(null)
    setEditingTodoTitle('')

    try {
      await editServiceTodo(userId, id, editingTodoTitle.trim())
    } catch (e) {
      setError('Failed to edit task.')

      // Revert optimistic update
      setTodos(previousTodos)
    }
  }

  const handleDeleteClick = id => {
    setTodoToDelete(id)
    setConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    // Optimistic update
    const previousTodos = [...todos]

    setTodos(todos.filter(todo => todo.id !== todoToDelete))
    setConfirmOpen(false)
    setTodoToDelete(null)

    try {
      await deleteServiceTodo(userId, todoToDelete)
    } catch (e) {
      setError('Failed to delete task.')

      // Revert optimistic update
      setTodos(previousTodos)
    }
  }

  const handleToggleComplete = async id => {
    // Optimistic update
    const previousTodos = [...todos]

    const updatedTodos = todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))

    setTodos(updatedTodos)

    try {
      await toggleCompleteServiceTodo(userId, id)
    } catch (e) {
      setError('Failed to update task status.')
      setTodos(previousTodos) // Revert the optimistic update
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
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault() // Prevents the form submission or new line
                      handleEditTodo(todo.id)
                    }
                  }}
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
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
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
