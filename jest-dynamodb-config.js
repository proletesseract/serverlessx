import { UserTable } from './platform-service/tables/user.dynamodb'
import { OrderTable } from './platform-service/tables/order.dynamodb'
import { AssetTable } from './platform-service/tables/asset.dynamodb'
import { TradeTable } from './platform-service/tables/trade.dynamodb'
import { PaymentTable } from './platform-service/tables/payment.dynamodb'

module.exports = {
  tables: [
    UserTable('jest').Properties,
    OrderTable('jest').Properties,
    AssetTable('jest').Properties,
    TradeTable('jest').Properties,
    PaymentTable('jest').Properties,
  ],
};