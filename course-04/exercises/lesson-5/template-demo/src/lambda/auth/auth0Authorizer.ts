import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { verify } from 'jsonwebtoken'
import { JwtToken } from "../../auth/JwtToken";

const secret = process.env.AUTH_O_SECRET


export const handler : CustomAuthorizerHandler = async(event : CustomAuthorizerEvent) : Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = verifyToken(event.authorizationToken)

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

function verifyToken(authorizationToken: string) : JwtToken {
    if(authorizationToken === null)
        throw new Error()

    if(!authorizationToken.toLowerCase().startsWith('bearer '))
        throw new Error()

    const token = authorizationToken.split(' ')[1]

    return verify(token, secret) as JwtToken
}