import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
    return todoAccess.getAllTodos()
}

export async function createTodo(request: CreateTodoRequest, userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()

    return todoAccess.createTodo({
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        name: request.name,
        dueDate: request.dueDate,
        done: false    
    })
}

export async function deleteTodo(todoId: string): Promise<void> {
    await todoAccess.deleteTodo(todoId)
}