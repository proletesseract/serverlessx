import { UserModel } from "../models/user.model";
import { BaseController, ControllerResponse } from "./_base.controller";

export class UserController extends BaseController {

  constructor() {
    super()
  }

  async getUser(value:string, model:UserModel, modelFunction:Function): Promise<ControllerResponse> {

    let user:Array<UserModel>
    try {
      user = await model[modelFunction.name](value)
    } catch(err) {
      return {
        error: {
          message: 'unable to fetch user',
          data: err
        }
      } as ControllerResponse
    }

    if (!user) {
      return {
        error: {
          message: 'user not found',
          data: new Error(`unable to find user using ${modelFunction.name}(${value})`)
        }
      } as ControllerResponse
    }

    return {
      data: {
        message: 'successfully retrieved user',
        user: user,
      }
    } as ControllerResponse

  }
  
}