export enum Values {
  satoshi = 100000000,
  dollarDecimal = 100,
  mBTC = 100000,
  wei = 1000000000000000000,
}

export class Utils {
  static enumToArray(Enum:any) {
    
    const tmp = []

    for (const prop in Enum) {
      if (Enum.hasOwnProperty(prop)) {
        tmp.push(Enum[prop])
      }
    }
      
    return tmp

  }

  static dollarRounded(value:string|number) {

    if (typeof value == 'string') {
      value = parseFloat(value)
    }

    return Math.round(value * Values.dollarDecimal) / Values.dollarDecimal;

  }

}