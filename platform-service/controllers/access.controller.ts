import { parseWith, RequestFormatters } from "../utils/request.util";
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

  constructor() {
    super()
  }

  async apiKeyAccess(apiKey:string, secret:string): Promise<ControllerResponse> {

    let apiAccess:ApiAccess

    try {
      apiAccess = parseWith(process.env.API_ACCESS, RequestFormatters.JSON)
    } catch (err) {
      return {
        error: {
          message: 'unable to parse api config',
          data: err
        }
      } as ControllerResponse
    }
    
    if (apiKey !== apiAccess.api_key || secret !== apiAccess.secret) {
      return {
        error: {
          message: 'unauthorised',
          data: new Error('invalid API key or secret')
        }
      } as ControllerResponse
    }
    
    return {
      data: {
        message: 'authorized',
      }
    } as ControllerResponse
  }

  async tokenAccess(headers:EventHeaders): Promise<ControllerResponse> {

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
      const tokenParts = headers.Authorization.split(' ')
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
      decoded = await jwt.verify(tokenValue, process.env.JWT_SECRET)
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