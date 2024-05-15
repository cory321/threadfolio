'use client'

import { useState, useEffect, Suspense, useTransition } from 'react'

import { Box, CircularProgress, IconButton, List, ListItem, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { useAuth } from '@clerk/nextjs'

import { deleteTodoAction, editTodoAction, loadTodosAction } from '@actions/todo'

const TodoListContent = ({ todos, setTodos }) => {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true)
        const token = await getToken({ template: 'supabase' })
        const todos = await loadTodosAction(token)

        setTodos(todos)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [setTodos, getToken])

  const handleDelete = async id => {
    const token = await getToken({ template: 'supabase' })

    try {
      await deleteTodoAction(id, token)
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleEdit = async (id, newTitle) => {
    const token = await getToken({ template: 'supabase' })

    try {
      const updatedTodo = await editTodoAction(id, newTitle, token)

      setTodos(prevTodos => prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)))
    } catch (error) {
      console.error('Error editing todo:', error)
    }
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Box>
      {todos && todos.length > 0 ? (
        <List>
          {todos.map(todo => (
            <ListItem key={todo.id}>
              <TodoItem todo={todo} onDelete={handleDelete} onEdit={handleEdit} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box>No todos available!</Box>
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
    <Box display='flex' alignItems='center' justifyContent='space-between'>
      {isEditing ? (
        <>
          <TextField value={newTitle} onChange={e => setNewTitle(e.target.value)} disabled={loading} />
          <IconButton onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
          <IconButton onClick={handleCancel} disabled={loading}>
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Box>{todo.title}</Box>
          <IconButton onClick={handleEdit} disabled={loading}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
          </IconButton>
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
