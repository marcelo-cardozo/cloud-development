import 'source-map-support/register'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getSignedAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
  try {
    const uploadUrl = await getSignedAttachmentUrl(userId, todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({})
    }
  }
  
})

handler.use(cors({
  credentials: true
}))