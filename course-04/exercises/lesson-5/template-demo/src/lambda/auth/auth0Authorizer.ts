import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { verify } from 'jsonwebtoken'
import { JwtToken } from "../../auth/JwtToken";
import AWS from "aws-sdk";

const secretsManager = new AWS.SecretsManager()
const auth0SecretId = process.env.AUTH_0_SECRET_ID
const auth0SecretField = process.env.AUTH_0_SECRET_FIELD

let cachedSecretToken = null

export const handler : CustomAuthorizerHandler = async(event : CustomAuthorizerEvent) : Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = await verifyToken(event.authorizationToken)

        return {
            principalId: jwtToken.sub, // Unique user id
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (error) {
        return {
            principalId: 'user', // Unique user id
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }

}

async function verifyToken(authorizationToken: string) : Promise<JwtToken> {
    if(authorizationToken === null)
        throw new Error()

    if(!authorizationToken.toLowerCase().startsWith('bearer '))
        throw new Error()

    const token = authorizationToken.split(' ')[1]

    const secretObject = await getSecretToken()
    const secret = secretObject[auth0SecretField]

    return verify(token, secret) as JwtToken
}

async function getSecretToken() : Promise<any> {
    if(cachedSecretToken !== null)
        return cachedSecretToken
        
    const secret = await secretsManager.getSecretValue({
        SecretId: auth0SecretId
    }).promise()
    cachedSecretToken = secret.SecretString

    return JSON.parse(cachedSecretToken)
}