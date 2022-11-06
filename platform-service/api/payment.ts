import { APIGatewayProxyHandler, APIGatewayEvent, SQSEvent } from 'aws-lambda'
import { ResponseFormatters, ResponseCodes, Response } from '../utils/response.util'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDocClient } from '../utils/dynamodb.util'
import { parseWith, RequestFormatters } from '../utils/request.util'
import { AccessController } from '../controllers/access.controller'
import { ControllerResponse } from '../controllers/_base.controller'
import { PaymentController } from '../controllers/payment.controller'
import { PaymentGateways, PaymentStatus, PaymentType } from '../models/payment.model'
import { AvailableCurrencies } from '../models/currencies.model'

const respondWithJson = new Response(ResponseFormatters.JSON)
const docClient: DocumentClient = createDocClient(process.env)

interface CreatePaymentRequest {
  trade_id: string,
  gateway: PaymentGateways,
  payment_type: PaymentType,
  payment_status: PaymentStatus,
  amount: number,
  currency: AvailableCurrencies,
}

export const createPaymentTrigger: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

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

  let parsed:CreatePaymentRequest
  try {

    parsed = parseWith(event.body, RequestFormatters.JSON)

    if (!parsed.trade_id || !parsed.gateway || !parsed.payment_type || !parsed.payment_status || !parsed.amount || !parsed.currency) {
      return respondWithJson.respond(ResponseCodes.BAD_REQUEST, {
        message: 'unable to process payment',
        error: new Error('invalid params'),
      })
    }
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, err)
  }

  const paymentController = new PaymentController(docClient)
  const createPaymentResponse = await paymentController.createPayment(parsed)
  
  if (createPaymentResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, createPaymentResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: createPaymentResponse.data,
  })
}     

export const createPaymentQueue = async (event: SQSEvent): Promise<any> => {
  
  try {

    if (!event || !event.Records || event.Records.length < 0) {
      console.log('no records found', event)
      return
    }

    for (const record of event.Records) {
      let parsed:CreatePaymentRequest
      parsed = JSON.parse(record.body)
      if (!parsed.trade_id || !parsed.gateway || !parsed.payment_type || !parsed.payment_status || !parsed.amount || !parsed.currency) {
        throw new Error('missing queue parameters')
      }
      const paymentController = new PaymentController(docClient)
      const createPaymentResponse = await paymentController.createPayment(parsed)
      
      if (createPaymentResponse.error) {
        console.error(createPaymentResponse)
      } else {
        console.log(createPaymentResponse)
      }
    }     

  } catch(err) {
    console.log('[Payment.queue] something went wrong', err, event)
  }
    
}