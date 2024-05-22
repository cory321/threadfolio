'use client'

import { useState } from 'react'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'
import Greeting from '@/components/todo/Greeting'

export default function Home() {
  const [todos, setTodos] = useState(null)

  return (
    <main>
      <div>
        <Greeting />
        <br />
        <h2>To do list</h2>
        <AddTodoForm todos={todos} setTodos={setTodos} />
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </main>
  )
}
