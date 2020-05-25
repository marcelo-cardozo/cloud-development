import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient()
const groupTable = process.env.GROUPS_TABLE
const imageTable = process.env.IMAGES_TABLE

export const handler : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    const groupId = event.pathParameters.groupId
    
    const groupIdExists = groupExists(groupId)
    if(!groupIdExists){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Group does not exists'
            })
        }
    }

    const image = JSON.parse(event.body)
    const newImage = {
        imageId: uuidv4(),
        groupId: groupId,
        timestamp: new Date().toISOString(),
        ...image
    }

    await docClient.put({
        TableName: imageTable,
        Item: newImage
    }).promise()

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(newImage)

    }

}

async function groupExists(groupId: string) : Promise<Boolean>{
    const result =await docClient.get({
        TableName: groupTable,
        Key:{
            id: groupId
        }
    }).promise()

    return result.Item != undefined
}