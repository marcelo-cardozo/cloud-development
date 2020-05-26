import { DynamoDBStreamHandler, DynamoDBStreamEvent } from "aws-lambda";
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const elasticsearchEndpoint = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [ elasticsearchEndpoint ],
    connectionClass: httpAwsEs
 })

export const handler : DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {

    for(const record of event.Records){
        
        if(record.eventName === 'INSERT'){
            const image = record.dynamodb.NewImage

            const imageId = image.imageId.S
            const body = {
                imageId,
                imageUrl: image.imageUrl.S,
                title: image.title.S,
                timestamp: image.timestamp.S,
                groupId: image.groupId.S
            }

            await es.index({
                index: 'images-index', // an index is like a table
                type: 'images', // a single index can contain multiple types
                id: imageId, // Document ID
                body: body
             })
        }

    }

}