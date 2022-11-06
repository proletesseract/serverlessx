import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'
import { parseWith, RequestFormatters } from '../utils/request.util'
import { ResponseFormatters, ResponseCodes, Response } from '../utils/response.util'

const respondWithJson = new Response(ResponseFormatters.JSON)

interface AuthRequest {
  email: string,
  password: string,
}

export const post: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  let authRequest:AuthRequest

  try {
    authRequest = parseWith(event.body, RequestFormatters.JSON)
  } catch (err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'unable to parse request',
      error: err,
    })
  }

  //@TODO: check user auth

  const jwtData = {
    email: authRequest.email
  }

  const token = jwt.sign(jwtData, process.env.JWT_SECRET, {
    expiresIn: process.env.AUTH_EXPIRY,
  })

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: {
      auth_token: token
    },
  })

}
