import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createTodo } from '../../businessLogic/todos'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  //const userId = getUserId(event)
  const userId = '1'
  
  const todo = await createTodo(newTodo, userId)
  
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todo
    })
  }
})

handler.use(cors({
  credentials: true
}))