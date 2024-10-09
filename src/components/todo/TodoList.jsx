'use client'

import { useState, useEffect, Suspense } from 'react'

import { Box, CircularProgress, IconButton, List, ListItem, TextField, Typography, Skeleton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { deleteTodo, editTodo, loadTodosAction } from '@/app/actions/todos'

const TodoListContent = ({ todos, setTodos }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true)
        const todos = await loadTodosAction()

        setTodos(todos)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [setTodos])

  const handleDelete = async id => {
    try {
      await deleteTodo(id)
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleEdit = async (id, newTitle) => {
    try {
      const updatedTodo = await editTodo(id, newTitle)

      setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)))
    } catch (error) {
      console.error('Error editing todo:', error)
    }
  }

  if (loading) {
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

const TodoList = ({ todos, setTodos }) => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <TodoListContent todos={todos} setTodos={setTodos} />
    </Suspense>
  )
}

export default TodoList
