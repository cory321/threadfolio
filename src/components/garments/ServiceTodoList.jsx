'use client'

import { useState, useEffect } from 'react'

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

import {
  getServiceTodos,
  addServiceTodo,
  editServiceTodo,
  deleteServiceTodo,
  toggleCompleteServiceTodo
} from '@/app/actions/serviceTodos'

export default function ServiceTodoList({ serviceId, onTasksLoaded }) {
  const { userId, getToken } = useAuth()
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
    async function fetchTodos() {
      try {
        const token = await getToken({ template: 'supabase' })
        const fetchedTodos = await getServiceTodos(userId, serviceId, token)

        setTodos(fetchedTodos)

        // Notify parent component about tasks
        if (onTasksLoaded) {
          onTasksLoaded(fetchedTodos.length > 0)
        }
      } catch (e) {
        setError('Failed to load tasks.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [userId, serviceId, getToken, onTasksLoaded])

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === '') return

    setIsAddingTodo(true)

    try {
      const token = await getToken({ template: 'supabase' })
      const todo = await addServiceTodo(userId, serviceId, newTodoTitle.trim(), token)

      setTodos([...todos, todo])
      setNewTodoTitle('')
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
      const token = await getToken({ template: 'supabase' })
      const updatedTodo = await editServiceTodo(userId, id, editingTodoTitle.trim(), token)

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
      const token = await getToken({ template: 'supabase' })

      await deleteServiceTodo(userId, todoToDelete, token)
      setTodos(todos.filter(todo => todo.id !== todoToDelete))
      setConfirmOpen(false)
      setTodoToDelete(null)
    } catch (e) {
      setError('Failed to delete task.')
    }
  }

  const handleToggleComplete = async id => {
    try {
      const token = await getToken({ template: 'supabase' })
      const updatedTodo = await toggleCompleteServiceTodo(userId, id, token)

      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)))
    } catch (e) {
      setError('Failed to update task status.')
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
