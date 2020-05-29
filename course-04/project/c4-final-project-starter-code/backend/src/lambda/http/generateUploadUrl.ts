import 'source-map-support/register'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getSignedAttachmentUrl } from '../../businessLogic/todos'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const signedUrl = getSignedAttachmentUrl(todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      signedUrl
    })
  }
})

handler.use(cors({
  credentials: true
}))