import { APIGatewayProxyHandler, APIGatewayEvent, SQSEvent } from 'aws-lambda'
import { ResponseFormatters, ResponseCodes, Response } from '../utils/response.util'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDocClient } from '../utils/dynamodb.util'
import { parseWith, RequestFormatters } from '../utils/request.util'
import { AccessController } from '../controllers/access.controller'
import { ControllerResponse, SeedOptions } from '../controllers/_base.controller'
import { OrderController } from '../controllers/order.controller'
import { AcceptedCurrencies, OrderModel, OrderStatus, OrderType } from '../models/order.model'
import { Utils } from '../utils/helper.util'

const respondWithJson = new Response(ResponseFormatters.JSON)
const docClient: DocumentClient = createDocClient(process.env)

interface OrderSeedRequest {
  api_key: string,
  secret: string,
}

export interface CreateOrderRequest {
  user_id: string,
  asset_id: string,
  order_type: OrderType,
  amount: number,
  currency: AcceptedCurrencies,
  match_order_id: string, //optional
}

export const seed: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  let orderSeedRequest:OrderSeedRequest

  try {
    orderSeedRequest = parseWith(event.body, RequestFormatters.JSON)
  } catch (err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'unable to parse request',
      error: err,
    })
  }

  const accessController:AccessController = new AccessController()

  let apiKeyAccessResponse:ControllerResponse
  try {
    apiKeyAccessResponse = await accessController.apiKeyAccess(orderSeedRequest.api_key, orderSeedRequest.secret)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem validating API credentials',
      error: err,
    })
  }

  if (apiKeyAccessResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, apiKeyAccessResponse.error)
  }

  const orderController:OrderController = new OrderController(docClient)

  let seedResponse:ControllerResponse
  try {
    const orderModel:OrderModel = new OrderModel(docClient)
    const seedOptions:SeedOptions = {model: orderModel, file: 'order.json', name: 'order'}
    seedResponse = await orderController.seed(seedOptions)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem seeding users',
      error: err,
    })
  }

  if (seedResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, seedResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: seedResponse.data,
  })

}

export const list: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  const type = event.pathParameters.type.toUpperCase()
  const status = event.pathParameters.status.toUpperCase()

  const orderController:OrderController = new OrderController(docClient)

  let getSellOrdersResponse:ControllerResponse 

  const orderTypeArray = Utils.enumToArray(OrderType)
  const orderStatusArray = Utils.enumToArray(OrderStatus)

  if (!orderTypeArray.includes(type) || !orderStatusArray.includes(status)) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'invalid parameters',
      error: new Error('required parameters do not match enum values'),
      data: {
        type,
        orderTypeArray,
        status,
        orderStatusArray,
      }
    })
  }

  try {
    getSellOrdersResponse = await orderController.getSellOrders(type, status)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem fetching user',
      error: err,
    })
  }

  if (getSellOrdersResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, getSellOrdersResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: getSellOrdersResponse.data,
  })

}

export const get: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {


  const orderController:OrderController = new OrderController(docClient)

  let getOrderResponse:ControllerResponse 

  if (!event.pathParameters.id) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'invalid parameters',
      error: new Error('no id in path parameters'),
      data: {
        pathParameters: event.pathParameters,
      }
    })
  }

  try {
    getOrderResponse = await orderController.getOrderById(event.pathParameters.id)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem fetching order',
      error: err,
    })
  }

  if (getOrderResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, getOrderResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: getOrderResponse.data,
  })

}

export const purchase: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {


  let orderId: string
  try {

    const parsed = parseWith(event.body, RequestFormatters.JSON)

    if (!parsed || !parsed.id) {
      return respondWithJson.respond(ResponseCodes.BAD_REQUEST, {
        message: 'unable to process purchase order',
        error: new Error('no id for purchase order'),
      })
    }
    orderId = parsed.id
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, err)
  }

  const accessController:AccessController = new AccessController()

  let tokenAccessResponse:ControllerResponse
  try {
    tokenAccessResponse = await accessController.tokenAccess(event.headers)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem validating credentials',
      error: err,
    })
  }

  const orderController:OrderController = new OrderController(docClient)

  let makePurchaseResponse:ControllerResponse 

  try {
    makePurchaseResponse = await orderController.makePurchase(orderId, tokenAccessResponse.data.decoded.email)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem making purchase',
      error: err,
    })
  }

  if (makePurchaseResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, makePurchaseResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: makePurchaseResponse.data,
  })

}

export const createOrderTrigger: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  const accessController:AccessController = new AccessController()

  let tokenAccessResponse:ControllerResponse
  try {
    tokenAccessResponse = await accessController.tokenAccess(event.headers)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem validating credentials',
      error: err,
    })
  }

  if (tokenAccessResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, tokenAccessResponse.error)

  }

  let parsed:CreateOrderRequest
  try {

    parsed = parseWith(event.body, RequestFormatters.JSON)

    if (!parsed.user_id || !parsed.asset_id || !parsed.order_type || !parsed.amount || !parsed.currency) {
      return respondWithJson.respond(ResponseCodes.BAD_REQUEST, {
        message: 'unable to process purchase order',
        error: new Error('no id for purchase order'),
      })
    }
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, err)
  }

  const orderController = new OrderController(docClient)
  const createOrderResponse = await orderController.createOrder(parsed)
  
  if (createOrderResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, createOrderResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: createOrderResponse.data,
  })
}     

export const createOrderQueue = async (event: SQSEvent): Promise<any> => {
  
  try {

    if (!event || !event.Records || event.Records.length < 0) {
      console.log('no records found', event)
      return
    }

    for (const record of event.Records) {
      let parsed:CreateOrderRequest
      parsed = JSON.parse(record.body)
      if (!parsed.user_id || !parsed.asset_id || !parsed.order_type || !parsed.amount || !parsed.currency) {
        throw new Error('missing queue parameters')
      }
      const orderController = new OrderController(docClient)
      const createOrderResponse = await orderController.createOrder(parsed)
      
      if (createOrderResponse.error) {
        console.error(createOrderResponse)
      } else {
        console.log(createOrderResponse)
      }
    }     

  } catch(err) {
    console.log('[Order.createOrderQueue] something went wrong', err, event)
  }
    
}