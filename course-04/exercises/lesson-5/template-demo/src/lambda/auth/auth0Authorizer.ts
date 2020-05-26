import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { verify } from 'jsonwebtoken'
import { JwtToken } from "../../auth/JwtToken";
import middy from 'middy';
import { secretsManager } from 'middy/middlewares';

const auth0SecretId = process.env.AUTH_0_SECRET_ID
const auth0SecretField = process.env.AUTH_0_SECRET_FIELD


export const handler = middy( async(event : CustomAuthorizerEvent, context) : Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = verifyToken(event.authorizationToken, context.AUTH_0_SECRET[auth0SecretField])

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

})

function verifyToken(authorizationToken: string, secret: string) : JwtToken {
    if(authorizationToken === null)
        throw new Error()

    if(!authorizationToken.toLowerCase().startsWith('bearer '))
        throw new Error()

    const token = authorizationToken.split(' ')[1]

    return verify(token, secret) as JwtToken
}

handler
    .use(secretsManager({
        cache: true,
        cacheExpiryInMillis: 60000,
        secrets: {
            AUTH_0_SECRET: auth0SecretId
        },
        throwOnFailedCall: true
    }))