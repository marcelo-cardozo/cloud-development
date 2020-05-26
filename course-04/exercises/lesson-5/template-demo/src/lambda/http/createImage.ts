import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
    signatureVersion: 'v4' // Use Sigv4 algorithm
})

const groupTable = process.env.GROUPS_TABLE
const imageTable = process.env.IMAGES_TABLE
const imagesBucket = process.env.IMAGES_S3_BUCKET
const signedExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)



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
    
    const imageId = uuidv4()

    const newImage = {
        imageId: imageId,
        groupId: groupId,
        timestamp: new Date().toISOString(),
        imageUrl: `https://${imagesBucket}.s3.amazonaws.com/${imageId}`,
        ...image
    }

    await docClient.put({
        TableName: imageTable,
        Item: newImage
    }).promise()

    const uploadUrl = getUploadUrl(imageId)
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem: newImage,
            uploadUrl: uploadUrl
        })

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

function getUploadUrl(imageId: string) : string {
    return s3.getSignedUrl('putObject', {
        Bucket: imagesBucket, // Name of an S3 bucket
        Key: imageId, // id of an object this URL allows access to
        Expires: signedExpiration  // A URL is only valid for . seconds
     })
}