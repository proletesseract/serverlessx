import { BaseModel, BaseParams } from './_base.model'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { AvailableCurrencies } from './currencies.model'

export interface Payment {
  id?: string
  trade_id: string
  gateway: PaymentGateways
  payment_type: PaymentType
  payment_status: PaymentStatus
  amount: number
  currency: AvailableCurrencies
  created?: number
  last_updated?: number
}

export enum PaymentGateways {
  STRIPE = "STRIPE",
  COINPAYMENTS = "COINPAYMENTS",
  BITPAY = "BITPAY",
}

export enum PaymentType {
  CRYPTO = "CRYPTO",
  CREDIT = "CREDIT",
  BANK = "BANK",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  TIMEDOUT = "TIMEDOUT",
  CANCELLED = "CANCELLED",
}

export class PaymentModel extends BaseModel {
  docClient: DocumentClient

  constructor(docClient: DocumentClient) {
    const baseParams: BaseParams = {
      TableName: 'payment-' + process.env.STAGE,
    }
    super(docClient, baseParams)
    this.docClient = docClient
  }

  async getPaymentByTradeIdAndStatus(tradeId: string, status: PaymentStatus): Promise<Array<Payment>> {

    if (!tradeId || !status) {
      console.error('invalid tradeId or status')
      return []
    }
        
    const params = this.createParamObject({
      IndexName: 'paymentTradeStatusIndex',
      KeyConditionExpression: 'trade_id = :tradeId AND payment_status = :orderStatus',
      ExpressionAttributeValues: {
        ':tradeId': tradeId,
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
