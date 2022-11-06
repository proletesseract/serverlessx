import { BaseModel, BaseParams } from './_base.model'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export interface User {
  id?: string
  first_name: string,
  last_name: string,
  email: string,
  password?: string,
  created?: number
  last_updated?: number
  last_login?: number
}

export class UserModel extends BaseModel {
  docClient: DocumentClient
  sensitiveProps: Array<string> = ['password']

  constructor(docClient: DocumentClient) {
    const baseParams: BaseParams = {
      TableName: 'user-' + process.env.STAGE,
    }
    super(docClient, baseParams)
    this.docClient = docClient
  }

  async getByEmail(email: string, stripSensitive:boolean=true) {

    try {
      if (email) {
        let params
        params = this.createParamObject({
          IndexName: 'emailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email
          },
        })
      
        const response = await this.getAllByGSI(params)
        if (!response || !response.Items || response.Items.length === 0) {
          return false
        }
        
        if (stripSensitive === true) {
          const stripped:User = {} as User
          for(const prop in response.Items[0]) {
            if (!this.sensitiveProps.includes(prop)) {
              stripped[prop] = response.Items[0][prop]
            }
          }
          return stripped
        } 

        return response.Items[0]

      }//if
    } catch(err) {
      return false
    }
  }

}
