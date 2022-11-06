export let OrderTable = (dbstage) => {
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
              AttributeName: 'order_type',
              AttributeType: 'S',
            },
            {
              AttributeName: 'order_status',
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
          TableName: `order-${dbstage}`,
          GlobalSecondaryIndexes: [
            {
              IndexName: 'orderStatusTypeIndex',
              KeySchema: [
                {
                  AttributeName: 'order_status',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: 'order_type',
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