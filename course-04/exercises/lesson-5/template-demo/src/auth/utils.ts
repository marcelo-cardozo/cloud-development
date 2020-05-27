import { decode } from 'jsonwebtoken'

import { JwtToken } from './JwtToken'

/**
 * Parse an authorization header and return a user id
 * @param jwtToken Authorization Header to parse
 * @returns a user id from the JWT token inside the authorization header
 */
export function getUserIdFromAuhorization(authorization: string): string {
  const jwtToken = getTokenFromAuhorization(authorization)

  const jwtDecoded = decode(jwtToken) as JwtToken 
  
  return jwtDecoded.sub
}


export function getTokenFromAuhorization(authorization: string): string {
  if(authorization === null)
    throw new Error()

  if(!authorization.toLowerCase().startsWith('bearer '))
    throw new Error()

  const jwtToken = authorization.split(' ')[1]
  return jwtToken
}