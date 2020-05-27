import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserIdFromAuhorization } from '../../auth/utils';

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

export const handler = middy( async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    
    console.log(event)

    const newItem = JSON.parse(event.body);

    const itemPut = {
        id: uuidv4(),
        userId: getUserIdFromAuhorization(event.headers.Authorization),
        ...newItem
    }

    console.log(itemPut)
    
    await docClient.put({
        TableName: groupsTable,
        Item: itemPut
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(itemPut)
    };
})

handler.use(cors({
    credentials:true
}))