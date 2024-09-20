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
  ListItemSecondaryAction,
  Typography,
  ButtonBase,
  Stack
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import ChecklistIcon from '@mui/icons-material/Checklist'

import { getServiceTodos, addServiceTodo, editServiceTodo, deleteServiceTodo } from '@/app/actions/serviceTodos'

export default function ServiceTodoList({ serviceId }) {
  const { userId, getToken } = useAuth()
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingTodoTitle, setEditingTodoTitle] = useState('')
  const [showTodoInput, setShowTodoInput] = useState(false)

  useEffect(() => {
    async function fetchTodos() {
      const token = await getToken({ template: 'supabase' })
      const fetchedTodos = await getServiceTodos(userId, serviceId, token)

      setTodos(fetchedTodos)

      // If there are existing todos, show the todo input
      if (fetchedTodos.length > 0) {
        setShowTodoInput(true)
      }
    }

    fetchTodos()
  }, [userId, serviceId, getToken])

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === '') return
    setIsLoading(true)
    const token = await getToken({ template: 'supabase' })
    const todo = await addServiceTodo(userId, serviceId, newTodoTitle.trim(), token)

    setTodos([...todos, todo])
    setNewTodoTitle('')
    setIsLoading(false)
    setShowTodoInput(true)
  }

  const handleEditTodo = async id => {
    if (editingTodoTitle.trim() === '') return
    const token = await getToken({ template: 'supabase' })
    const updatedTodo = await editServiceTodo(userId, id, editingTodoTitle.trim(), token)

    setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)))
    setEditingTodoId(null)
    setEditingTodoTitle('')
  }

  const handleDeleteTodo = async id => {
    const token = await getToken({ template: 'supabase' })

    await deleteServiceTodo(userId, id, token)
    setTodos(todos.filter(todo => todo.id !== id))
  }

  if (!showTodoInput && todos.length === 0) {
    // Render the "Create Todo List" button
    return (
      <Stack direction='row' spacing={2} justifyContent='flex-end'>
        <ButtonBase
          onClick={() => setShowTodoInput(true)}
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            p: 1,
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'action.hover',
              '& .MuiSvgIcon-root': { color: 'primary.main' },
              '& .MuiTypography-root': { color: 'primary.main' }
            }
          }}
        >
          <ChecklistIcon sx={{ mb: 0.5, fontSize: '2rem', color: 'text.secondary' }} />
          <Typography variant='caption' color='text.secondary'>
            Create Todo List
          </Typography>
        </ButtonBase>
      </Stack>
    )
  }

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={2}>
        <TextField
          fullWidth
          size='small'
          variant='outlined'
          placeholder='Add a new todo...'
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleAddTodo()
            }
          }}
          disabled={isLoading}
        />
        <IconButton color='primary' onClick={handleAddTodo} disabled={isLoading || newTodoTitle.trim() === ''}>
          <AddIcon />
        </IconButton>
      </Box>
      {todos.length > 0 ? (
        <List>
          {todos.map(todo => (
            <ListItem key={todo.id}>
              {editingTodoId === todo.id ? (
                <>
                  <TextField
                    value={editingTodoTitle}
                    onChange={e => setEditingTodoTitle(e.target.value)}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge='end' onClick={() => handleEditTodo(todo.id)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton edge='end' onClick={() => setEditingTodoId(null)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              ) : (
                <>
                  <ListItemText primary={todo.title} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      onClick={() => {
                        setEditingTodoId(todo.id)
                        setEditingTodoTitle(todo.title)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton edge='end' onClick={() => handleDeleteTodo(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant='body2' color='textSecondary'>
          No todos available.
        </Typography>
      )}
    </Box>
  )
}
