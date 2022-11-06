import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CreateOrderRequest } from "../api/order";
import { Asset, AssetModel } from "../models/asset.model";
import { Order, OrderModel, OrderStatus, OrderType } from "../models/order.model";
import { TradeStatus } from "../models/trade.model";
import { UserModel } from "../models/user.model";
import { Queue } from "../utils/queue.util";
import { UserController } from "./user.controller";
import { BaseController, ControllerResponse } from "./_base.controller";

export class OrderController extends BaseController {

  private docClient:DocumentClient

  constructor(docClient: DocumentClient) {
    super()
    this.docClient = docClient
  }

  async makePurchase(orderId: string, buyerEmail: string): Promise<ControllerResponse> {
    
    const userModel:UserModel = new UserModel(this.docClient)
    const userController:UserController = new UserController()
  
    let userResponse:ControllerResponse
    try {
      userResponse = await userController.getUser(buyerEmail, userModel, userModel.getByEmail)
    } catch(err) {
      return {
        error: {
          message: 'unable to find buyer',
          data: err
        }
      } as ControllerResponse
    }

    if (userResponse.error) {
      return userResponse
    }

    const orderModel:OrderModel = new OrderModel(this.docClient)
    let sellOrder:Order
    try {
      sellOrder = await orderModel.get(orderId)
    } catch(err) {
      return {
        error: {
          message: 'unable to find sell order',
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
        user_id: userResponse.data.user.id,
        asset_id: sellOrder.asset_id,
        order_type: OrderType.BUY,
        amount: sellOrder.amount,
        currency: sellOrder.currency,
        match_order_id: sellOrder.id
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
        message: 'buy order successfully queued',
      }
    } as ControllerResponse
  }

  async createOrder(createOrderRequest:CreateOrderRequest): Promise<ControllerResponse> {

    const newOrder:Order = {
      user_id: createOrderRequest.user_id,
      asset_id: createOrderRequest.asset_id,
      order_type: createOrderRequest.order_type,
      order_status: OrderStatus.OPEN,
      amount: createOrderRequest.amount,
      currency: createOrderRequest.currency,
    }

    const orderModel:OrderModel = new OrderModel(this.docClient)

    let savedOrder:Order
    try {
      savedOrder = await orderModel.put(newOrder)
    } catch(err) {
      return {
        error: {
          message: 'unable to find sell order',
          data: err
        }
      } as ControllerResponse
    }

    if (!createOrderRequest.match_order_id) {
      return {
        data: {
          message: 'successfully created order',
          order: savedOrder,
        }
      } as ControllerResponse
    }
    
    let matchedOrder:Order
    try {
      matchedOrder = await orderModel.get(createOrderRequest.match_order_id)
    } catch(err) {
      return {
        error: {
          message: 'unable to find sell order',
          data: err
        }
      } as ControllerResponse
    }

    let queuesConfig
    try {
      queuesConfig = JSON.parse(process.env.QUEUES)
      if (!queuesConfig.createTrade || !queuesConfig.createTrade.url) {
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
        buy_order_id: savedOrder.id,
        sell_order_id: matchedOrder.id,
        trade_status: TradeStatus.PENDING_PAYMENT,
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
        message: 'buy order successfully queued',
      }
    } as ControllerResponse

  }

  async getSellOrders(type: OrderType, status: OrderStatus): Promise<ControllerResponse> {
    const orderModel:OrderModel = new OrderModel(this.docClient)

    let orders:Array<Order>
    try {
      orders = await orderModel.getOrdersByStatusAndType(status, type)
    } catch(err) {
      return {
        error: {
          message: 'unable to fetch existing orders',
          data: err
        }
      } as ControllerResponse
    }

    const assetModel:AssetModel = new AssetModel(this.docClient)

    const assetIds = orders.map((it) => it.asset_id)

    let assets:Array<Asset>
    try {
      assets = await assetModel.getBatch(assetIds)
    } catch(err) {
      return {
        error: {
          message: 'unable to fetch associated assets',
          data: err
        }
      } as ControllerResponse
    }

    return {
      data: {
        message: 'successfully retrieved orders and assets',
        orders: orders,
        assets: assets[`asset-${process.env.STAGE}`],
      }
    } as ControllerResponse

  }

  async getOrderById(id:string): Promise<ControllerResponse> {

    const orderModel:OrderModel = new OrderModel(this.docClient)

    let order:Order
    try {
      order = await orderModel.get(id)
    } catch(err) {
      return {
        error: {
          message: 'unable to fetch order',
          data: err
        }
      } as ControllerResponse
    }

    if (!order) {
      return {
        error: {
          message: 'order not found',
          data: new Error(`unable to find order ${id})`)
        }
      } as ControllerResponse
    }

    return {
      data: {
        message: 'successfully retrieved order',
        order: order,
      }
    } as ControllerResponse

  }
  
}