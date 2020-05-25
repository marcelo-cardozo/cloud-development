import { S3Handler, S3Event } from 'aws-lambda'
import 'source-map-support/register'

const docClient = new AWS.DynamoDB.DocumentClient()

export const handler : S3Handler = async (event: S3Event) => {
    for(const record of event.Records){
        console.log(record.s3.object.key);
    }

}
