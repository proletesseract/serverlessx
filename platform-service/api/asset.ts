import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import { ResponseFormatters, ResponseCodes, Response } from '../utils/response.util'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDocClient } from '../utils/dynamodb.util'
import { parseWith, RequestFormatters } from '../utils/request.util'
import { AccessController } from '../controllers/access.controller'
import { ControllerResponse, SeedOptions } from '../controllers/_base.controller'
import { AssetController } from '../controllers/asset.controller'
import { AssetModel } from '../models/asset.model'

const respondWithJson = new Response(ResponseFormatters.JSON)
const docClient: DocumentClient = createDocClient(process.env)

interface AssetSeedRequest {
  api_key: string,
  secret: string,
}

export const seed: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {

  let assetSeedRequest:AssetSeedRequest

  try {
    assetSeedRequest = parseWith(event.body, RequestFormatters.JSON)
  } catch (err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'unable to parse request',
      error: err,
    })
  }

  const accessController:AccessController = new AccessController()

  let apiKeyAccessResponse:ControllerResponse
  try {
    apiKeyAccessResponse = await accessController.apiKeyAccess(assetSeedRequest.api_key, assetSeedRequest.secret)
  } catch(err) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, {
      message: 'problem validating API credentials',
      error: err,
    })
  }

  if (apiKeyAccessResponse.error) {
    return respondWithJson.respond(ResponseCodes.SERVER_ERROR, apiKeyAccessResponse.error)
  }

  const assetController:AssetController = new AssetController()

  let seedResponse:ControllerResponse
  try {
    const assetModel:AssetModel = new AssetModel(docClient)
    const seedOptions:SeedOptions = {model: assetModel, file: 'asset.json', name: 'asset'}
    seedResponse = await assetController.seed(seedOptions)
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
