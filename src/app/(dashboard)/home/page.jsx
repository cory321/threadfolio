'use client'

import { useState } from 'react'

import { useUser } from '@clerk/nextjs'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'

export default function Home() {
  const { user } = useUser()
  const [todos, setTodos] = useState(null)

  return (
    <main>
      <div>
        <h1>Welcome {user?.firstName}</h1>
        <AddTodoForm todos={todos} setTodos={setTodos} />
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </main>
  )
}
