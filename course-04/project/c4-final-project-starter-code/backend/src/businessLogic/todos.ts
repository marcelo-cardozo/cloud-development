import * as uuid from 'uuid'

import { AttachmentAccess } from '../dataLayer/attachmentAccess'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()
const attachmentAccess = new AttachmentAccess()

export async function getAllTodos(userId : string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
}

export async function createTodo(userId: string, request: CreateTodoRequest): Promise<TodoItem> {

    const todoId = uuid.v4()

    return todoAccess.createTodo({
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        name: request.name,
        dueDate: request.dueDate,
        done: false,
        attachmentUrl: attachmentAccess.getUrlFromKey(todoId)
    })
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    return todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId: string, todoId: string, request: UpdateTodoRequest): Promise<void>  {
    return todoAccess.updateTodo(userId, todoId, {
        name: request.name,
        dueDate: request.dueDate,
        done: request.done    
    })
}

export async function getSignedAttachmentUrl(userId:string, todoId:string) : Promise<string>{
    const todo = await todoAccess.getTodo(userId, todoId)
    console.log(todo)
    if (todo)
        return attachmentAccess.getSignedUrl(todoId)
    else{
        throw new Error('The Todo is not from the user ')
    }

}