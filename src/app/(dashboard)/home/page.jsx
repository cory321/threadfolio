'use client'

import { useState, useEffect } from 'react'

import { useUser } from '@clerk/nextjs'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'

export default function Home() {
  const { isSignedIn, isLoading, user } = useUser()
  const [todos, setTodos] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      setAuthLoading(false)
    }
  }, [isLoading])

  if (authLoading) {
    return <CircularProgress />
  }

  if (!isSignedIn) {
    return null // or you can redirect to sign-in page or show a message
  }

  return (
    <main>
      <div>
        <h1>Welcome {user.firstName}</h1>
        <AddTodoForm todos={todos} setTodos={setTodos} />
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </main>
  )
}
