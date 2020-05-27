import { SNSHandler, SNSEvent, S3Event, S3EventRecord } from "aws-lambda";
import * as AWS from 'aws-sdk'
import Jimp from 'jimp';

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})
  
const imagesTable = process.env.IMAGES_TABLE
const thumbnailsBucket = process.env.THUMBNAILS_S3_BUCKET
const imagesBucket = process.env.IMAGES_S3_BUCKET

export const handler : SNSHandler = async (event: SNSEvent) => {
    console.log(JSON.stringify(event))

    for(const snsRecord of event.Records){
        const s3EventStr = snsRecord.Sns.Message
        const s3Event = JSON.parse(s3EventStr)

        for(const s3Record of s3Event.Records ){
            await processImage(s3Record)
        }
    }

}

async function processImage(record: S3EventRecord) {
    const imageId = record.s3.object.key

    const originalImageResponse = await s3.getObject({
        Bucket: imagesBucket,
        Key: imageId
    }).promise()

    const originalImageBody : Buffer = Buffer.from(originalImageResponse.Body)
    
    const image = await Jimp.read(originalImageBody)
    image.resize(150, Jimp.AUTO)
    const resizedImage = await image.getBufferAsync(image.getMIME())

    await s3.putObject({
        Bucket: thumbnailsBucket,
        Key: `${imageId}.jpeg`,
        Body: resizedImage
    }).promise()

}