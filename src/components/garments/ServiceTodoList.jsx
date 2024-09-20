'use client'

import { useState, useEffect } from 'react'

import { useAuth } from '@clerk/nextjs'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

import { getServiceTodos, addServiceTodo, editServiceTodo, deleteServiceTodo } from '@/app/actions/serviceTodos'

export default function ServiceTodoList({ serviceId }) {
  const { userId, getToken } = useAuth()
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingTodoTitle, setEditingTodoTitle] = useState('')

  useEffect(() => {
    async function fetchTodos() {
      const token = await getToken({ template: 'supabase' })
      const fetchedTodos = await getServiceTodos(userId, serviceId, token)

      setTodos(fetchedTodos)
    }

    fetchTodos()
  }, [userId, serviceId, getToken])

  const handleAddTodo = async () => {
    setIsLoading(true)
    const token = await getToken({ template: 'supabase' })
    const todo = await addServiceTodo(userId, serviceId, 'Todo item', token)

    setTodos([...todos, todo])
    setIsLoading(false)
  }

  const handleEditTodo = async id => {
    const token = await getToken({ template: 'supabase' })
    const updatedTodo = await editServiceTodo(userId, id, editingTodoTitle, token)

    setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)))
    setEditingTodoId(null)
    setEditingTodoTitle('')
  }

  const handleDeleteTodo = async id => {
    const token = await getToken({ template: 'supabase' })

    await deleteServiceTodo(userId, id, token)
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={1}>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Todo List
        </Typography>
        <IconButton color='primary' onClick={handleAddTodo} disabled={isLoading}>
          <AddIcon />
        </IconButton>
      </Box>
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
    </Box>
  )
}
