import { S3Handler, S3Event } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'

const docClient = new AWS.DynamoDB.DocumentClient()
const connectionsTable = process.env.CONNECTIONS_TABLE

const stage = process.env.STAGE
const apiId = process.env.API_ID
const connectionParams = {
    apiVersion: '2018-11-29',
    endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`
}

const apiGategay = new AWS.ApiGatewayManagementApi(connectionParams)

export const handler : S3Handler = async (event: S3Event) => {
    const connections = await docClient.scan({
        TableName: connectionsTable
    }).promise()
    console.log('connections: '+ JSON.stringify(connections))

    for(const record of event.Records){
        const payload = {
            imageId: record.s3.object.key
        }

        for(const connection of connections.Items){
            console.log('sending message to '+ JSON.stringify(connection))
            await sendMessage(connection.id, payload)
            console.log('message sent to '+ JSON.stringify(connection))
        }
    }

}

async function sendMessage(connectionId, payload) {

    try {
        await apiGategay.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(payload)
        }).promise()
        console.log('message sent')
    } catch (error) {
        console.log('Error sending message '+ JSON.stringify(error))
        if(error.statusCode === 410){
            await docClient.delete({
                TableName: connectionsTable,
                Key: {
                    id: connectionId
                }
            }).promise()
        }
    }

}