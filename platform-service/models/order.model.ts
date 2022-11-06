import { BaseModel, BaseParams } from './_base.model'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export interface Order {
  id?: string
  user_id: string
  asset_id: string
  order_type: OrderType
  amount: number
  currency: AcceptedCurrencies
  order_status: OrderStatus
  created?: number
  last_updated?: number
}

export enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FILLED = "FILLED",
  PARTIAL = "PARTIAL",
}

export enum AcceptedCurrencies {
  USD = "USD",
  BTC = "BTC",
  ETH = "ETH",
}

export class OrderModel extends BaseModel {
  docClient: DocumentClient

  constructor(docClient: DocumentClient) {
    const baseParams: BaseParams = {
      TableName: 'order-' + process.env.STAGE,
    }
    super(docClient, baseParams)
    this.docClient = docClient
  }

  async getOrdersByStatusAndType(status: OrderStatus, type: OrderType): Promise<Array<Order>> {

    if (!type || !status) {
      console.error('invalid type or status')
      return []
    }
    
    const params = this.createParamObject({
      IndexName: 'orderStatusTypeIndex',
      KeyConditionExpression: 'order_type = :orderType AND order_status = :orderStatus',
      ExpressionAttributeValues: {
        ':orderType': type,
        ':orderStatus': status,
      },
    })
    
    try {
      const response = await this.getAllByGSI(params)
      return response.Items
    } catch(err) {
      console.error('error', err)
    }

    return []

  }

}
