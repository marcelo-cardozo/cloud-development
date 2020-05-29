import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('gettodos')

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  
  logger.info('getalltodos: ', userId)
  const todos = await getAllTodos(userId)
  logger.info('todos: ', todos)
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }

})

handler.use(cors({
  credentials: true
}))
