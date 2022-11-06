export let TradeTable = (dbstage) => {
    return {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'buy_order_id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'sell_order_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: `trade-${dbstage}`,
          GlobalSecondaryIndexes: [
            {
              IndexName: 'buySellIndex',
              KeySchema: [
                {
                  AttributeName: 'buy_order_id',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: 'sell_order_id',
                  KeyType: 'RANGE'
                },
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            },
          ]
        },
      }
}