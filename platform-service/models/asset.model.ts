import { BaseModel, BaseParams } from './_base.model'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export interface Asset {
  id?: string
  owner_id: string
  collection_id: string
  name: string
  type: AssetType
  url: string
  attributes: Record<string,any>
  created?: number
  last_updated?: number
}

export enum AssetType {
  NFT = "NFT",
  STOCK = "STOCK",
  CRYPTOCURRENCY = "CRYPTOCURRENCY",
}

export class AssetModel extends BaseModel {
  docClient: DocumentClient

  constructor(docClient: DocumentClient) {
    const baseParams: BaseParams = {
      TableName: 'asset-' + process.env.STAGE,
    }
    super(docClient, baseParams)
    this.docClient = docClient
  }
}
