import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import middy from 'middy';
import { cors } from 'middy/middlewares';

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

export const handler = middy( async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {

    const newItem = JSON.parse(event.body);

    const itemPut = {
        id: uuidv4(),
        ...newItem
    }
    
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