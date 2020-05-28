import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

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

export async function updateTodo(request: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
    // check user to update todo?

    return todoAccess.updateTodo(todoId, {
        name: request.name,
        dueDate: request.dueDate,
        done: request.done    
    })
}