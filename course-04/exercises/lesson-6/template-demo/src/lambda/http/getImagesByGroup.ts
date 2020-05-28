import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const imagesTable = process.env.IMAGES_TABLE
const groupsTable = process.env.GROUPS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    const groupId = event.pathParameters.groupId

    const groupIdExists = await groupExists(groupId)

    if(!groupIdExists){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Group does not exist'
            })
        }
    }

    const queryParams = {
        TableName: imagesTable,
        KeyConditionExpression: 'groupId = :groupId',
        ExpressionAttributeValues: {
            ':groupId': groupId
        },
        ScanIndexForward: false
    }

    const result = await docClient.query(queryParams).promise()
    
    const items = result.Items

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: items
        })
    }
}

async function groupExists(groupId: String) : Promise<Boolean> {
    const result = await docClient.get({
        TableName: groupsTable,
        Key:{
            id: groupId
        }
    }).promise()

    return result.Item != undefined
}