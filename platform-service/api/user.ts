import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import { ResponseFormatters, ResponseCodes, Response } from '../utils/response.util'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDocClient } from '../utils/dynamodb.util'
import { parseWith, RequestFormatters } from '../utils/request.util'
import { AccessController } from '../controllers/access.controller'
import { ControllerResponse, SeedOptions } from '../controllers/_base.controller'
import { UserController } from '../controllers/user.controller'
import { UserModel } from '../models/user.model'

const respondWithJson = new Response(ResponseFormatters.JSON)
const docClient: DocumentClient = createDocClient(process.env)

interface UserSeedRequest {
  api_key: string,
  secret: string,
}

export const seed: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  let userSeedRequest:UserSeedRequest

  try {
    userSeedRequest = parseWith(event.body, RequestFormatters.JSON)
  } catch (err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'unable to parse request',
      error: err,
    })
  }

  const accessController:AccessController = new AccessController()

  let apiKeyAccessResponse:ControllerResponse
  try {
    apiKeyAccessResponse = await accessController.apiKeyAccess(userSeedRequest.api_key, userSeedRequest.secret)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem validating API credentials',
      error: err,
    })
  }

  if (apiKeyAccessResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, apiKeyAccessResponse.error)
  }

  const userController:UserController = new UserController()

  let seedResponse:ControllerResponse
  try {
    const userModel:UserModel = new UserModel(docClient)
    const seedOptions:SeedOptions = {model: userModel, file: 'user.json', name: 'user'}
    seedResponse = await userController.seed(seedOptions)

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

export const get: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  if (!event.pathParameters || !event.pathParameters.id) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'no id parsed for user look up',
      error: new Error('required event.pathParameters not set')
    })
  }

  const { id } = event.pathParameters

  const accessController:AccessController = new AccessController()

  let tokenAccessResponse:ControllerResponse
  try {
    tokenAccessResponse = await accessController.tokenAccess(event.headers)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem validating API credentials',
      error: err,
    })
  }

  if (tokenAccessResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, tokenAccessResponse.error)
  }

  let getUserResponse:ControllerResponse 
  
  const userModel:UserModel = new UserModel(docClient)
  const userController:UserController = new UserController()

  try {
    getUserResponse = await userController.getUser(id, userModel, userModel.get)
  } catch(err) {
    return {
      error: {
        message: 'unable to find buyer',
        data: err
      }
    } as ControllerResponse
  }

  if (getUserResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, getUserResponse.error)
  }

  return respondWithJson.respond(ResponseCodes.OK, {
    message: 'OK',
    data: getUserResponse.data,
  })

}
