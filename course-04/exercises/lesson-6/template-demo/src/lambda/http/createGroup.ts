import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import middy from 'middy'
import {cors} from 'middy/middlewares'

import { CreateGroupRequest } from '../../requests/CreateGroupRequest'
import { createGroup } from '../../businessLogic/groups'
import { getTokenFromAuhorization } from '../../auth/utils';

export const handler = middy( async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    
    console.log(event)

    const jwtToken = getTokenFromAuhorization(event.headers.Authorization)
    
    const newGroup: CreateGroupRequest = JSON.parse(event.body)
    const newItem = await createGroup(newGroup, jwtToken)

    return {
        statusCode: 201,
        body: JSON.stringify(newItem)
    };
})

handler.use(cors({
    credentials:true
}))