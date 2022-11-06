export let PaymentTable = (dbstage) => {
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
              AttributeName: 'trade_id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'payment_status',
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
          TableName: `payment-${dbstage}`,
          GlobalSecondaryIndexes: [
            {
              IndexName: 'paymentTradeStatusIndex',
              KeySchema: [
                {
                  AttributeName: 'trade_id',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: 'payment_status',
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