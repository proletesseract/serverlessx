import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export function createDocClient(env: Record<string, any>): DocumentClient {
  let options

  if (env.STAGE == 'local') {
    options = {
      endpoint: env.SLS_A_ENDPOINT,
      region: 'localhost',
      accessKeyId: env.SLS_A_ACCESS_KEY_ID,
      secretAccessKey: env.SLS_A_SECRET_ACCESS_KEY,
    }    
  } else {
    options = {
      region: process.env.SLS_A_REGION,
      accessKeyId: env.SLS_A_ACCESS_KEY_ID,
      secretAccessKey: env.SLS_A_SECRET_ACCESS_KEY,
    }     
  }

  return new DocumentClient(options)
}
