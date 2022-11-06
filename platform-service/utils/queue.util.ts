import * as AWS from 'aws-sdk'

export class Queue {

  constructor() {
  }

  async get(): Promise<AWS.SQS> {
    const config = {
      accessKeyId: process.env.SLS_A_ACCESS_KEY_ID,
      secretAccessKey: process.env.SLS_A_SECRET_ACCESS_KEY,
      region: process.env.SLS_A_REGION,
    }
    AWS.config.update(config)
    const sqs = new AWS.SQS()

    return sqs
  }

  async publish(sqs, params) {

    return new Promise((resolve, reject) => {
      sqs.sendMessage(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

}