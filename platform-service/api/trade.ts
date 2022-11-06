import { APIGatewayProxyHandler, APIGatewayEvent, SQSEvent } from 'aws-lambda'
import { ResponseFormatters, ResponseCodes, Response } from '../utils/response.util'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDocClient } from '../utils/dynamodb.util'
import { parseWith, RequestFormatters } from '../utils/request.util'
import { AccessController } from '../controllers/access.controller'
import { ControllerResponse } from '../controllers/_base.controller'
import { TradeController } from '../controllers/trade.controller'
import { TradeStatus } from '../models/trade.model'

const respondWithJson = new Response(ResponseFormatters.JSON)
const docClient: DocumentClient = createDocClient(process.env)

interface CreateTradeRequest {
  buy_order_id: string,
  sell_order_id: string,
  trade_status: TradeStatus,
}

export interface CompleteTradeRequest {
  id: string,
}

export const createTradeTrigger: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

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

  let parsed:CreateTradeRequest
  try {

    parsed = parseWith(event.body, RequestFormatters.JSON)

    if (!parsed.buy_order_id || !parsed.sell_order_id || !parsed.trade_status) {
      return respondWithJson.respond(ResponseCodes.BAD_REQUEST, {
        message: 'unable to process trade',
        error: new Error('no id for trade'),
      })
    }
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, err)
  }

  const tradeController = new TradeController(docClient)
  const createTradeResponse = await tradeController.createTrade(parsed)
  
  if (createTradeResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, createTradeResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: createTradeResponse.data,
  })
}     

export const createTradeQueue = async (event: SQSEvent): Promise<any> => {
  
  try {

    if (!event || !event.Records || event.Records.length < 0) {
      console.log('no records found', event)
      return
    }

    for (const record of event.Records) {
      let parsed:CreateTradeRequest
      parsed = JSON.parse(record.body)
      if (!parsed.buy_order_id || !parsed.sell_order_id || !parsed.trade_status) {
        throw new Error('missing queue parameters')
      }
      const tradeController = new TradeController(docClient)
      const createTradeResponse = await tradeController.createTrade(parsed)
      
      if (createTradeResponse.error) {
        console.error(createTradeResponse)
      } else {
        console.log(createTradeResponse)
      }
    }     

  } catch(err) {
    console.log('[Trade.queue] something went wrong', err, event)
  }
    
}

export const completeTradeTrigger: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

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

  let parsed:CompleteTradeRequest
  try {

    parsed = parseWith(event.body, RequestFormatters.JSON)

    if (!parsed.id) {
      return respondWithJson.respond(ResponseCodes.BAD_REQUEST, {
        message: 'unable to process trade',
        error: new Error('no id for trade'),
      })
    }
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, err)
  }

  const tradeController = new TradeController(docClient)
  const createTradeResponse = await tradeController.completeTrade(parsed)
  
  if (createTradeResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, createTradeResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: createTradeResponse.data,
  })
}     

export const completeTradeQueue = async (event: SQSEvent): Promise<any> => {
  
  try {

    if (!event || !event.Records || event.Records.length < 0) {
      console.log('no records found', event)
      return
    }

    for (const record of event.Records) {
      let parsed:CompleteTradeRequest
      parsed = JSON.parse(record.body)
      if (!parsed.id) {
        throw new Error('missing queue parameters')
      }
      const tradeController = new TradeController(docClient)
      const createTradeResponse = await tradeController.completeTrade(parsed)
      
      if (createTradeResponse.error) {
        console.error(createTradeResponse)
      } else {
        console.log(createTradeResponse)
      }
    }     

  } catch(err) {
    console.log('[Trade.queue] something went wrong', err, event)
  }
    
}