import { readFileSync } from "fs";
import path from "path";
import { AssetModel } from "../models/asset.model";
import { OrderModel } from "../models/order.model";
import { UserModel } from "../models/user.model";

export interface SeedOptions {
  model: UserModel|OrderModel|AssetModel,
  file: string,
  name: string,
}

export class BaseController {
  constructor() {}

  async seed(options:SeedOptions): Promise<ControllerResponse> {

    let existingItems:Array<SeedOptions["model"]>
    try {
      existingItems = await options.model.list()
    } catch(err) {
      return {
        error: {
          message: `unable to fetch existing ${options.name} items`,
          data: err
        }
      } as ControllerResponse
    }

    if (existingItems && existingItems.length > 0) {
      return {
        data: {
          message: `${options.name} items already seeded`,
          users: existingItems,
        }
      } as ControllerResponse 
    }    

    let seedItems:Array<SeedOptions["model"]>
    try {
      const seedData = readFileSync(path.resolve(__dirname, `${process.env.DB_SEEDS_PATH}/${options.file}`))
      seedItems = JSON.parse(seedData.toString())
    } catch (err) {
      return {
        error: {
          message: `unable to parse ${options.name} seed items`,
          data: err
        }
      } as ControllerResponse
    }

    try {
      await options.model.putBatch(seedItems)
    } catch (err) {
      return {
        error: {
          message: `unable to write ${options.name} seed items to database`,
          data: err
        }
      } as ControllerResponse
    }

    let newItems:Array<UserModel>
    try {
      newItems = await options.model.list()
    } catch(err) {
      return {
        error: {
          message: `unable to fetch new ${options.name} items`,
          data: err
        }
      } as ControllerResponse
    }
    
    return {
      data: {
        message: `new ${options.name} items seeded`,
        items: newItems,
      }
    } as ControllerResponse
  }
}

export type ControllerResponse = {
  error?: ControllerError
  data?: Record<string, any>
  type?: ControllerResponseTypes,
}

export enum ResponseCode {
  
}

export type ControllerError = {
  message: string,
  code?: string,
  data?: Record<string, any>
}

export enum ControllerResponseTypes {
  SERVER_ERROR = 'SEVER_ERROR',
  RETRY = 'RETRY',
  ACTION_REQUIRED = 'ACTION_REQUIRED',  
  SUCCESS = 'SUCCESS',
}


