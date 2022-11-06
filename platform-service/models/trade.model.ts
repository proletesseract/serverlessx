import { BaseModel, BaseParams } from './_base.model'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export interface Trade {
  id?: string
  buy_order_id: string
  sell_order_id: string
  trade_status: TradeStatus
  created?: number
  last_updated?: number
}

export enum TradeStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export class TradeModel extends BaseModel {
  docClient: DocumentClient

  constructor(docClient: DocumentClient) {
    const baseParams: BaseParams = {
      TableName: 'trade-' + process.env.STAGE,
    }
    super(docClient, baseParams)
    this.docClient = docClient
  }
}
