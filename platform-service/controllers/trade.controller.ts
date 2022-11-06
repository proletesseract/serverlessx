import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CompleteTradeRequest } from "../api/trade";
import { Order, OrderModel, OrderStatus } from "../models/order.model";
import { Payment, PaymentGateways, PaymentModel, PaymentStatus, PaymentType } from "../models/payment.model";
import { Trade, TradeModel, TradeStatus } from "../models/trade.model";
import { Queue } from "../utils/queue.util";
import { BaseController, ControllerResponse } from "./_base.controller";

export class TradeController extends BaseController {

  private docClient:DocumentClient

  constructor(docClient: DocumentClient) {
    super()
    this.docClient = docClient
  }

  async createTrade(createTradeRequest): Promise<ControllerResponse> {

    const orderModel:OrderModel = new OrderModel(this.docClient)

      let sellOrder:Order
      let buyOrder:Order
    try {
      sellOrder = await orderModel.get(createTradeRequest.sell_order_id)
      buyOrder = await orderModel.get(createTradeRequest.buy_order_id)
    } catch(err) {
      return {
        error: {
          message: 'unable to find trades to match',
          data: err
        }
      } as ControllerResponse
    }
    
    //@TODO: do whatever checks necessary to confirm the trade is valid
    if (sellOrder.amount !== buyOrder.amount) {
      return {
        error: {
          message: 'unable to match trades',
          data: {
            sellOrder,
            buyOrder,
          }
        }
      } as ControllerResponse
    }

    const newTrade:Trade = {
      buy_order_id: createTradeRequest.buy_order_id,
      sell_order_id: createTradeRequest.sell_order_id,
      trade_status: createTradeRequest.trade_status,
    }

    const tradeModel:TradeModel = new TradeModel(this.docClient)

    let savedTrade:Trade
    try {
      savedTrade = await tradeModel.put(newTrade)
    } catch(err) {
      return {
        error: {
          message: 'unable to save trade',
          data: err
        }
      } as ControllerResponse
    }

    let queuesConfig
    try {
      queuesConfig = JSON.parse(process.env.QUEUES)
      if (!queuesConfig.createOrder || !queuesConfig.createOrder.url) {
        throw new Error('bad queues config')
      }
    } catch (error) {
      throw new Error('unable to parse queues config')
    }  

    let queueService:Queue
    let sqs:AWS.SQS
    let messageBody: string
    try {
      queueService = new Queue()
      sqs = await queueService.get() 
  
      messageBody = JSON.stringify({
        trade_id: savedTrade.id,
        gateway: PaymentGateways.STRIPE,
        payment_type: PaymentType.CREDIT,
        payment_status: PaymentStatus.PENDING,
        amount: sellOrder.amount,
        currency: sellOrder.currency,
      })
  
    } catch(err) {
      console.log('err', err)
    }

    const params = {
      MessageBody: messageBody,
      QueueUrl: queuesConfig.createOrder.url,
    }

    if (process.env.STAGE !== 'local') {
      await queueService.publish(sqs, params)
    } else {
      console.log(messageBody)
    }



    return {
      data: {
        message: 'trade successfully created',
        trade: savedTrade,
      }
    } as ControllerResponse

  }

  async completeTrade(completeOrderRequest:CompleteTradeRequest): Promise<ControllerResponse> {

    const tradeModel:TradeModel = new TradeModel(this.docClient)

    let tradeToComplete:Trade
    try {
      tradeToComplete = await tradeModel.get(completeOrderRequest.id)
    } catch(err) {
      return {
        error: {
          message: 'error retrieving trade to complete',
          data: err
        }
      } as ControllerResponse
    }

    if (!tradeToComplete) {
      return {
        error: {
          message: 'unable to find trade',
          data: new Error(`trade not found ${completeOrderRequest.id}`)
        }
      } as ControllerResponse
    }

    const orderModel:OrderModel = new OrderModel(this.docClient)

    let sellOrder:Order
    try {
      sellOrder = await orderModel.get(tradeToComplete.sell_order_id)
    } catch(err) {
      return {
        error: {
          message: 'error retrieving sell order',
          data: err
        }
      } as ControllerResponse
    }

    if (!sellOrder) {
      return {
        error: {
          message: 'unable to find sell order',
          data: new Error(`sell order not found ${tradeToComplete.sell_order_id}`)
        }
      } as ControllerResponse
    }

    let buyOrder:Order
    try {
      buyOrder = await orderModel.get(tradeToComplete.buy_order_id)
    } catch(err) {
      return {
        error: {
          message: 'error retrieving buy order',
          data: err
        }
      } as ControllerResponse
    }

    if (!buyOrder) {
      return {
        error: {
          message: 'unable to find buy order',
          data: new Error(`sell order not found ${tradeToComplete.buy_order_id}`)
        }
      } as ControllerResponse
    }

    const paymentModel:PaymentModel = new PaymentModel(this.docClient)

    let payments:Array<Payment>
    try {
      payments = await paymentModel.getPaymentByTradeIdAndStatus(tradeToComplete.id, PaymentStatus.SUCCESSFUL)
    } catch(err) {
      return {
        error: {
          message: 'error retrieving payments',
          data: err
        }
      } as ControllerResponse
    }

    if (!payments || payments.length === 0) {
      return {
        error: {
          message: 'unable to find successful payments',
          data: new Error(`successful payments not found ${tradeToComplete.sell_order_id}`)
        }
      } as ControllerResponse
    }

    //@TODO: do whatever checks necessary to confirm trade is still able to be completed
    if (buyOrder.order_status !== OrderStatus.OPEN 
      && sellOrder.order_status !== OrderStatus.OPEN
      && !payments[0]) {
      return {
        error: {
          message: 'unable to complete trade',
          data: {
            sellOrder,
            buyOrder,
            tradeToComplete,
            payments,
          }
        }
      } as ControllerResponse
    }

    buyOrder.order_status = OrderStatus.FILLED
    sellOrder.order_status = OrderStatus.FILLED
    tradeToComplete.trade_status = TradeStatus.COMPLETED

    let updatedBuyOrder
    let updatedSellOrder
    let updatedTrade
    try {
      updatedBuyOrder = await orderModel.put(buyOrder)
      updatedSellOrder = await orderModel.put(sellOrder)
      updatedTrade = await tradeModel.put(tradeToComplete)
    } catch (err) {
      //@TODO: have rollback mechanisms if any of these writes fail
      return {
        error: {
          message: 'error writing to database',
          data: err
        }
      } as ControllerResponse
    }

    return {
      data: {
        message: 'trade successfully completed',
        data: {
          buyOrder: updatedBuyOrder,
          sellOrder: updatedSellOrder,
          trade: updatedTrade,
          payment: payments[0],
        }
      }
    } as ControllerResponse

  }
  
}