import { S3 } from "aws-sdk";
import * as AWS from "aws-sdk"
import * as AWSXRay from "aws-xray-sdk"

const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentAccess{
    constructor(
        private readonly s3: S3 = createS3Client(),
        private readonly attachmentsBucket = process.env.ATTACHMENTS_S3_BUCKET,
        private readonly signedExpiration = 3600
    ) {}

    getSignedUrl(key: string) : string{
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.attachmentsBucket, // Name of an S3 bucket
            Key: key, // id of an object this URL allows access to
            Expires: this.signedExpiration  // A URL is only valid for . seconds
        })
    }

    getUrlFromKey(key: string) : string {
        if(process.env.IS_OFFLINE){
            return `http://localhost:${process.env.OFFLINE_PORT_S3}/${this.attachmentsBucket}/${key}`
        }
        return `https://${this.attachmentsBucket}.s3.amazonaws.com/${key}`
    }
}


function createS3Client(): S3{
    if(process.env.IS_OFFLINE){
        console.log('Creating offline S3 client')    

        return new XAWS.S3({
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: `http://localhost:${process.env.OFFLINE_PORT_S3}`,
            signatureVersion: 'v4'
          });

    }

    return new XAWS.S3({
        signatureVersion: 'v4'
    })
}