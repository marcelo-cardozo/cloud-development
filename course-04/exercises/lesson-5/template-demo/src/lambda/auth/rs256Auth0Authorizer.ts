import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from "aws-lambda";
import { verify } from 'jsonwebtoken'
import { JwtToken } from "../../auth/JwtToken";
import { getTokenFromAuhorization } from '../../auth/utils';

const cert = process.env.AUTH_0_CERTIFICATE

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
    const token = getTokenFromAuhorization(authorizationToken)

    return verify(token, cert, {algorithms: ['RS256']} ) as JwtToken
}
