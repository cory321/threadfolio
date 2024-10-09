'use client'

import { useState, Suspense } from 'react'

import useSWR from 'swr'
import { useAuth } from '@clerk/nextjs'
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  Skeleton,
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { deleteTodo, editTodo, loadTodosAction, addTodo } from '@/app/actions/todos'

const TodoListContent = () => {
  const { userId } = useAuth()
  const { data: todos, error, isLoading, mutate } = useSWR('todos', loadTodosAction)
  const [newTodo, setNewTodo] = useState('')
  const [isAddingTodo, setIsAddingTodo] = useState(false)

  const handleAddTodo = async e => {
    e.preventDefault()
    if (newTodo === '') return

    setIsAddingTodo(true)

    try {
      // Optimistic update
      const optimisticTodo = { id: Date.now(), title: newTodo, user_id: userId }

      mutate([...todos, optimisticTodo], false)

      const addedTodo = await addTodo(userId, newTodo)

      // Update with the actual todo from the server
      mutate(currentTodos => currentTodos.map(todo => (todo.id === optimisticTodo.id ? addedTodo : todo)), false)

      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)

      // Revert the optimistic update
      mutate()
    } finally {
      setIsAddingTodo(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteTodo(id)
      mutate(
        todos.filter(todo => todo.id !== id),
        false
      )
    } catch (error) {
      console.error('Error deleting todo:', error)
      mutate()
    }
  }

  const handleEdit = async (id, newTitle) => {
    try {
      const updatedTodo = await editTodo(id, newTitle)

      mutate(
        todos.map(todo => (todo.id === id ? updatedTodo : todo)),
        false
      )
    } catch (error) {
      console.error('Error editing todo:', error)
      mutate()
    }
  }

  if (error) return <Typography color='error'>Error loading todos</Typography>

  if (isLoading) {
    return (
      <List>
        {[1, 2].map(item => (
          <ListItem key={item} sx={{ mb: 1 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
              <Skeleton variant='text' width='70%' height={40} />
              <Box display='flex' alignItems='center'>
                <Skeleton variant='circular' width={40} height={40} sx={{ mr: 1 }} />
                <Skeleton variant='circular' width={40} height={40} />
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <Box>
      <Box component='form' onSubmit={handleAddTodo} display='flex' alignItems='center' mb={2}>
        <TextField
          onChange={e => setNewTodo(e.target.value)}
          value={newTodo}
          disabled={isAddingTodo}
          fullWidth
          placeholder='Add a new task...'
          size='small'
          sx={{ mr: 2 }}
        />
        <Button type='submit' variant='contained' color='primary' disabled={isAddingTodo} sx={{ whiteSpace: 'nowrap' }}>
          Add Todo
        </Button>
      </Box>
      {todos && todos.length > 0 ? (
        <List>
          {todos.map(todo => (
            <ListItem
              key={todo.id}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
            >
              <TodoItem todo={todo} onDelete={handleDelete} onEdit={handleEdit} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No todos available!</Typography>
      )}
    </Box>
  )
}

const TodoItem = ({ todo, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(todo.title)
  const [loading, setLoading] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    setLoading(true)
    await onEdit(todo.id, newTitle)
    setLoading(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setNewTitle(todo.title)
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(todo.id)
    setLoading(false)
  }

  return (
    <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
      {isEditing ? (
        <>
          <TextField
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            disabled={loading}
            size='small'
            fullWidth
            sx={{ marginRight: 1 }}
          />
          <Box display='flex' alignItems='center'>
            <IconButton onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <SaveIcon />}
            </IconButton>
            <IconButton onClick={handleCancel} disabled={loading}>
              <CancelIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <Box flexGrow={1}>
            <Typography variant='body1'>{todo.title}</Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <IconButton onClick={handleEdit} disabled={loading}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  )
}

const TodoList = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <TodoListContent />
    </Suspense>
  )
}

export default TodoList
