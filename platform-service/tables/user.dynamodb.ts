export let UserTable = (dbstage) => {
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
              AttributeName: 'email',
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
          TableName: `user-${dbstage}`,
          GlobalSecondaryIndexes: [
            {
              IndexName: 'emailIndex',
              KeySchema: [
                {
                  AttributeName: 'email',
                  KeyType: 'HASH'
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