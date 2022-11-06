export class Response {
  private formatter: ResponseFormatters
  private headers: Record<string, string>

  constructor(formatter: ResponseFormatters) {
    this.formatter = formatter

    if (process.env.HEADERS) {
      try {
        this.headers = JSON.parse(process.env.HEADERS)
      } catch (error) {
        throw new Error('unable to parse headers')
      }
    }   

  }

  respond(statusCode: ResponseCodes, data: any = null): HttpResponse {
    if (statusCode < 100 || statusCode > 599) {
      throw new Error('status code out of range')
    }

    const response: HttpResponse = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }

    if (this.headers) {
      if (this.headers.allowOrigin) response.headers['Access-Control-Allow-Origin'] = this.headers.allowOrigin
      if (this.headers.allowMethods) response.headers['Access-Control-Allow-Methods'] = this.headers.allowMethods
    } 

    switch (this.formatter) {
      case 'JSON':
        response.body = JSON.stringify(data)
        break
      default:
        response.body = data
    }

    return response
  }
}

export type HttpResponse = {
  body?: string
  statusCode: number
  headers: Record<string, unknown>
}

export enum ResponseFormatters {
  'JSON' = 'JSON',
}

export enum ResponseCodes {
  'BAD_REQUEST' = 400,
  'UNAUTHORISED' = 401,
  'OK' = 200,
  'SERVER_ERROR' = 500,
}

export enum ResponseTypes {
  'POST' = 'post',
  'GET' = 'get',
}