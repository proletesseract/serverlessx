import { /**
 * @function parseWith
 * @param process.env.API_ACCESS - The process.env.API_ACCESS parameter.
 * @param RequestFormatters.JSON - The RequestFormatters.JSON parameter.
 */
parseWith, RequestFormatters } from "../utils/request.util";
import { BaseController, ControllerResponse } from "./_base.controller";
import * as jwt from 'jsonwebtoken'

type ApiAccess = {
  api_key: string,
  secret: string,
}

type EventHeaders = {
  Authorization: string,
  'x-access-token': string,
}

type DecodedToken = {
  email: string,
  iat: number,
  exp: number,
}

export class AccessController extends BaseController {

  /**
 * @function constructor
 * @param  - The  parameter.
 */
constructor() {
    /**
 * @function super
 * @param  - The  parameter.
 */
super()
  }

  async /**
 * @function apiKeyAccess
 * @param apiKey:string - The apiKey:string parameter.
 * @param secret:string - The secret:string parameter.
 */
apiKeyAccess(apiKey:string, secret:string): Promise<ControllerResponse> {

    let apiAccess:ApiAccess

    try {
      apiAccess = parseWith(process.env.API_ACCESS, RequestFormatters.JSON)
    } /**
 * @function /**
 * @function catch
 * @param err - The err parameter.
 */
catch
 * @param err - The err parameter.
 */
catch (err) {
      return {
        error: {
          message: 'unable to parse api config',
          data: err
        }
      } as ControllerResponse
    }
    
    /**
 * @function /**
 * @function /**
 * @function /**
 * @function /**
 * @function /**
 * @function if
 * @param !tokenValue - The !tokenValue parameter.
 */
if
 * @param headers['x-access-token'] - The headers['x-access-token'] parameter.
 */
if
 * @param headers.Authorization - The headers.Authorization parameter.
 */
if
 * @param !headers.Authorization && !headers['x-access-token'] - The !headers.Authorization && !headers['x-access-token'] parameter.
 */
if
 * @param !process.env.JWT_SECRET - The !process.env.JWT_SECRET parameter.
 */
if
 * @param apiKey !== apiAccess.api_key || secret !== apiAccess.secret - The apiKey !== apiAccess.api_key || secret !== apiAccess.secret parameter.
 */
if (apiKey !== apiAccess.api_key || secret !== apiAccess.secret) {
      return {
        error: {
          message: 'unauthorised',
          data: new /**
 * @function /**
 * @function /**
 * @function /**
 * @function Error
 * @param 'no authorisation token found' - The 'no authorisation token found' parameter.
 */
Error
 * @param 'no authorisation headers found' - The 'no authorisation headers found' parameter.
 */
Error
 * @param 'invalid JWT configuration' - The 'invalid JWT configuration' parameter.
 */
Error
 * @param 'invalid API key or secret' - The 'invalid API key or secret' parameter.
 */
Error('invalid API key or secret')
        }
      } as ControllerResponse
    }
    
    return {
      data: {
        message: 'authorized',
      }
    } as ControllerResponse
  }

  async /**
 * @function tokenAccess
 * @param headers:EventHeaders - The headers:EventHeaders parameter.
 */
tokenAccess(headers:EventHeaders): Promise<ControllerResponse> {

    if (!process.env.JWT_SECRET) {
      return {
        error: {
          message: 'unauthorised',
          data: new Error('invalid JWT configuration')
        }
      } as ControllerResponse
    }

    if (!headers.Authorization && !headers['x-access-token']) {
      return {
        error: {
          message: 'unauthorised',
          data: new Error('no authorisation headers found')
        }
      } as ControllerResponse
    }

    let tokenValue
    
    if (headers.Authorization) {
      const tokenParts = headers.Authorization./**
 * @function split
 * @param ' ' - The ' ' parameter.
 */
split(' ')
      tokenValue = tokenParts[1]
    } else if (headers['x-access-token']) {
      tokenValue = headers['x-access-token']
    }

    if (!tokenValue) {
      return {
        error: {
          message: 'unauthorised',
          data: new Error('no authorisation token found')
        }
      } as ControllerResponse
    }

    //validate the token
    let decoded: DecodedToken
    try {
      decoded = await jwt./**
 * @function verify
 * @param tokenValue - The tokenValue parameter.
 * @param process.env.JWT_SECRET - The process.env.JWT_SECRET parameter.
 */
verify(tokenValue, process.env.JWT_SECRET)
    } catch (err) {
      return {
        error: {
          message: 'unauthorised',
          data: err
        }
      } as ControllerResponse
    }    

    return {
      data: {
        message: 'authorized',
        decoded: decoded,
      }
    } as ControllerResponse
  }
  
}