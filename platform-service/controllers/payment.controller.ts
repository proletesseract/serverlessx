import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Payment, PaymentModel, PaymentStatus } from "../models/payment.model";
import { Queue } from "../utils/queue.util";
import { BaseController, ControllerResponse } from "./_base.controller";

export class PaymentController extends BaseController {

  private docClient:DocumentClient

  constructor(docClient: DocumentClient) {
    super()
    this.docClient = docClient
  }

  async createPayment(createPaymentRequest): Promise<ControllerResponse> {

    const newPayment:Payment = {
      trade_id: createPaymentRequest.trade_id,
      gateway: createPaymentRequest.gateway,
      payment_type: createPaymentRequest.payment_type,
      payment_status: createPaymentRequest.payment_status,
      amount: createPaymentRequest.amount,
      currency: createPaymentRequest.currency,
    }

    const paymentModel:PaymentModel = new PaymentModel(this.docClient)
    
    //@TODO: do whatever checks necessary to make sure the payment is valid

    //@TODO: create payment request with external provdier

    //@TODO: mocking payment as successful

    newPayment.payment_status = PaymentStatus.SUCCESSFUL

    let savedPayment:Payment
    try {
      savedPayment = await paymentModel.put(newPayment)
    } catch(err) {
      return {
        error: {
          message: 'unable to save payment',
          data: err
        }
      } as ControllerResponse
    }

    let queuesConfig
    try {
      queuesConfig = JSON.parse(process.env.QUEUES)
      if (!queuesConfig.completeTrade || !queuesConfig.completeTrade.url) {
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
        id: createPaymentRequest.trade_id
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
        message: 'payment successfully created',
        payment: savedPayment,
      }
    } as ControllerResponse

  }
  
}