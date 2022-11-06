import { Utils } from "./helper.util"

export function parseWith(data: string, formatter: RequestFormatters): any {

  let parsed:any

  if (!data) {
    throw new Error('[request.util.parseWith] no data to parse')
  }

  if (!Utils.enumToArray(RequestFormatters).includes(formatter)) {
    throw new Error('[request.util.parseWith] invalid formatter')
  }

  try {
    switch (formatter) {
      case 'JSON':
        parsed = JSON.parse(data)
        break
      default:
        throw new Error('[request.util.parseWith] invalid formatter')
    }

    return parsed
  } catch (e) {
    throw new Error('[request.util.parseWith] parser not handled')
  }
}

export type UnknownObject = {
  [key: string]: any
}

export enum RequestFormatters {
  JSON = 'JSON',
}
