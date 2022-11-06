import { v4 as uuidv4 } from 'uuid'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export interface BaseParams {
  TableName: string
  ConsistentRead?: boolean
}

export interface DynamoBatches extends Array<DynamoItems>{}

export interface DynamoItems extends Array<Record<string, any>> {}

export interface DynamoPromises extends Array<Promise<any>> {}

export class BaseModel {
  docClient: DocumentClient
  baseParams: BaseParams
  batchSize: number

  constructor(docClient: DocumentClient, baseParams: BaseParams) {
    this.docClient = docClient
    this.baseParams = baseParams
    this.batchSize = 25
  }

  createParamObject(additionalArgs = {}): any {
    return Object.assign({}, this.baseParams, additionalArgs)
  }

  async put(data: Record<string, any>): Promise<any> {
    let newData
    if (!data.id) {
      data.id = uuidv4()
      newData = data
    } else {
      newData = await this.get(data.id)
      newData = {
        ...data,
      }
    }

    if (!newData.createdOn) {
      newData.createdOn = Date.now()
    }

    newData.lastUpdated = Date.now()

    const params = this.createParamObject({ Item: newData })

    try {
      await this.docClient.put(params).promise()
    } catch (error) {
      console.log('docClient.put error', error)
      throw new Error(error)
    }

    return newData
  }

  async get(id: string): Promise<any> {
    const params = this.createParamObject({ Key: { id } })
    const response = await this.docClient.get(params).promise()
    //console.log('[BaseModel.get] response', response)
    return response.Item
  }

  // @NOTE this is limited to 100 items
  async getBatch(ids: Array<string>): Promise<any> {
    const keysArray: Array<Record<string, any>> = []
    for (const id of ids) {
      keysArray.push({
        'id': id
      })
    }
    const params = {
      RequestItems: {
        [this.baseParams.TableName]: {
          Keys: keysArray,
        }
      }
    }
    const response = await this.docClient.batchGet(params).promise()
    return response.Responses || []
  }

  //only use for dev & currency
  async list(consistent:boolean = false): Promise<any> {
    const params = this.createParamObject({
      ConsistentRead: consistent
    })

    let items:Array<any> = []
    let lastEvalKey = true
    
    while (lastEvalKey) {
      const response = await this.docClient.scan(params).promise()
      items = items.concat(response.Items)
      if (response.LastEvaluatedKey) {
        params.ExclusiveStartKey = response.LastEvaluatedKey
      } else {
        lastEvalKey = false
      }
    }

    return items
  }

  //dont use this, only for server maintenance
  async delete(id) {
    const params = this.createParamObject({ Key: { id } })
    await this.docClient.delete(params).promise()
    return id
  }

  //dont use this, only for server maintenance
  async deleteBatch(items: DynamoItems) {
    let batches: DynamoBatches = []
    if (items.length > this.batchSize) {
      batches.push(items.slice(0, this.batchSize))
      for (let i = this.batchSize, l = items.length; i < l; i += this.batchSize) {
        const batch: DynamoItems = items.slice(i, i + this.batchSize)
        batches.push(batch)
      }
    } else {
      batches.push(items)
    }

    let promises: Array<Promise<any>> = []

    for (const batch of batches) {
      let requestItems = []
      for (const item of batch) {
        requestItems.push({
          DeleteRequest: {
            Key: {
              id: item.id,
            },
          },
        })
      }
    
      const params = {
        RequestItems: {
          [this.baseParams.TableName]: requestItems,
        },
        ReturnItemCollectionMetrics: 'SIZE',
        ReturnConsumedCapacity: 'TOTAL',
      }
      promises.push(this.docClient.batchWrite(params).promise())
    }
    
    while(promises.length > 0) {
      let batchResult:Array<any> = []
      try {
        batchResult = await Promise.all(promises)
      } catch(err) {
        console.log('promise all error', err)
      }
      promises = [] //clear the promises
      for (const result of batchResult) {
        if (Object.keys(result.UnprocessedItems).length !== 0) {
          //console.log('unprocessed found', result)
          const params = {
            RequestItems: {
              [this.baseParams.TableName]: result.UnprocessedItems[this.baseParams.TableName],
            },
            ReturnItemCollectionMetrics: 'SIZE',
            ReturnConsumedCapacity: 'TOTAL',
          }
          promises.push(this.docClient.batchWrite(params).promise())
        }
      }
    }//while
  }

  async putBatch(items: DynamoItems): Promise<any> {

    if (items.length == 0) {
      //console.log('nothing to put:', items)
      return
    }

    for (const item of items) {
      if (!item.id) {
        item.id = uuidv4()
      }
  
      if (!item.createdOn) {
        item.createdOn = Date.now()
      }
  
      item.lastUpdated = Date.now()
    }

    let batches: DynamoBatches = []
    if (items.length > this.batchSize) {
      batches.push(items.slice(0, this.batchSize))
      for (let i = this.batchSize, l = items.length; i < l; i += this.batchSize) {
        const batch: DynamoItems = items.slice(i, i + this.batchSize)
        batches.push(batch)
      }
    } else {
      batches.push(items)
    }

    let promises: Array<Promise<any>> = []

    for (const batch of batches) {
      let requestItems = []
      for (const item of batch) {
        requestItems.push({
          PutRequest: {
            Item: item,
          },
        })
      }
    
      const params = {
        RequestItems: {
          [this.baseParams.TableName]: requestItems,
        },
        ReturnItemCollectionMetrics: 'SIZE',
        ReturnConsumedCapacity: 'TOTAL',
      }
      promises.push(this.docClient.batchWrite(params).promise())
    }
    
    while(promises.length > 0) {
      let batchResult:Array<any> = []
      try {
        batchResult = await Promise.all(promises)
      } catch(err) {
        console.log('promise all error', err)
      }
      promises = [] //clear the promises
      for (const result of batchResult) {
        if (Object.keys(result.UnprocessedItems).length !== 0) {
          //console.log('unprocessed found', result)
          const params = {
            RequestItems: {
              [this.baseParams.TableName]: result.UnprocessedItems[this.baseParams.TableName],
            },
            ReturnItemCollectionMetrics: 'SIZE',
            ReturnConsumedCapacity: 'TOTAL',
          }
          promises.push(this.docClient.batchWrite(params).promise())
        }
      }
    }//while
  }

  async getAllByGSI(params) {
    let items:Array<any> = []
    let lastEvalKey = true
    
    while (lastEvalKey) {
      const response = await this.docClient.query(params).promise()
      items = items.concat(response.Items)
      if (response.LastEvaluatedKey) {
        params.ExclusiveStartKey = response.LastEvaluatedKey
      } else {
        lastEvalKey = false
      }
    }

    return {Items: items}
  }

}
