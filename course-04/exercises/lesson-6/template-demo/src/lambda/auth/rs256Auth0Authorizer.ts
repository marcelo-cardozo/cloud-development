import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from "aws-lambda";
import { verify } from 'jsonwebtoken'
import { JwtToken } from "../../auth/JwtToken";
import { getTokenFromAuhorization } from '../../auth/utils';

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJZ0bWDzSITffnMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGW1hcmNlbG8tY2FyZG96by5hdXRoMC5jb20wHhcNMjAwNTI2MTkwNDM1WhcN
MzQwMjAyMTkwNDM1WjAkMSIwIAYDVQQDExltYXJjZWxvLWNhcmRvem8uYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz4Pi5wi9leEVjyvZ
gxDcPyZZW/n7oa0q+5XSu7d/5ubVHUgc4ytmKOzYPlzGF6KxIXj/ImnsVfGMxElF
Z+lsruaARX8kVtAnRCh8SY1s6sG0UJtJ063cA1REjbOv9rjUZgay9tf7VmsuJ+yv
cFxsTwlAe8oMk5Hqn/PByhaPDsmQkNuv9k2BMd/0mZAJGCQ/4ThpUCnJSFHrnxq+
AENlcTw1bDFsbOlqmHPKT+JT52wL5IjZvUn1HNsKjlxCVWJb0Jt8pKYxw25TFoaU
V9aWDQznrUz9hZSZtNubzZ5LPOzi04iZHYLi/K0RFVDuKjSgo1UXoEZ7JBKt0umg
K+6DVQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTMHzXqti29
ZvaCxKSRlfPAXXPn4jAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHLr5+v67nBeLHPE5hVQmQUOt6ZXvOFRf+A+oWv7heAm664Bem/pyS2fzDlG/MVT
Xj2jwVfRvYfToiqtqoKYIqiCpihdpT4YVBBmCDD+nWRG46dMUm2TnRE8y+hFBCYH
iWMzUibum1uo13Z9Qw36LJJT5WIaJeYE9M3RocM3Dd9agh1XGDMxi1Zsqk17S2Gy
/XPd9RQJ0Y3pO7mLUSOsjYs4aDBCWTKpiTc8E+tw+KISpZsNvJFpjG9WnXh31g9d
zXPv88piu5SQkzE61MCvdjzw1C89+Yt4OE9vaVzyO3fXLeBw4DPnXwxHB5wF3LHj
pml66IndQplG9YEqzZj45w4=
-----END CERTIFICATE-----`

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
