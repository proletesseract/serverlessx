import type { Serverless } from 'serverless'
import { UserTable } from './platform-service/tables/user.dynamodb'
import { OrderTable } from './platform-service/tables/order.dynamodb'
import { AssetTable } from './platform-service/tables/asset.dynamodb'
import { TradeTable } from './platform-service/tables/trade.dynamodb'
import { PaymentTable } from './platform-service/tables/payment.dynamodb'

const serverlessConfiguration: Serverless = {
  service: 'immutablex',
  app: 'taxoshi',
  org: 'taxoshi',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      watch: true,
    },
    'serverless-offline': {
      useChildProcesses: true
    },
    stage: '${opt:stage, "local"}',
    environment: {
      SLS_A_REGION: {
        local: 'localhost'
      },
      SLS_A_ENDPOINT: {
        local: 'http://localhost:8000'
      },
      SLS_A_ACCESS_KEY_ID: {
        local: 'XXXXX'
      },
      SLS_A_SECRET_ACCESS_KEY: {
        local: 'XXXXXXXXXX'
      },
      AUTH_EXPIRY: {
        local: '1d'
      },
      JWT_SECRET: {
        local: 'UyY@yEf4YqYRFAKAGP9i9MD$cM&DcL6rNVpJ6lO%Gh%2$%432h@0tK$QYw6xnzD^@c@9iLz%p#J2Jm60#8un8Kcx7vyBFmH49R#'
      },
      API_ACCESS: {
        local: JSON.stringify({
          api_key: '4a982222-fc29-49f5-8e47-a6ea24df188e',
          secret: 'FgW^u$8Tn*hczq^SnxABtZaP45t7XfKIHtm6XL^4G2K28b2hEXxZ7FMeq8wSo4vPNHIzcjReQfm4OgK2QISaCJQrJJ*1M@Re21%',
        })
      },
      DB_SEEDS_PATH: {
        local: '../../../../platform-service/offline/seeds'
      },
      QUEUES: {
        local: JSON.stringify({
          createOrder: {
            url: 'https://sqs.ap-southeast-2.amazonaws.com/XXX/CreateOrder-dev',
          },
          completeTrade: {
            url: 'https://sqs.ap-southeast-2.amazonaws.com/XXX/CompleteTrade-dev',
          },
          createTrade: {
            url: 'https://sqs.ap-southeast-2.amazonaws.com/XXX/CreateTrade-dev',
          },
          createPayment: {
            url: 'https://sqs.ap-southeast-2.amazonaws.com/XXX/CreatePayment-dev',
          }
        }),
      },
      QUEUE_STAGE: {
        local: 'dev',
        dev: 'dev',
      }
    },
    dynamodb: {
      stages: ['local'],
      start: {
        port: 8000,
        migrate: true,
        dbPath: '/mnt/c/Users/craig/Projects/ImmutableX/dynamodb', //set to your own path
      },
      migration: {
        dir: './platform-service/offline/migrations',
        table_suffix: `-${process.env.DBSTAGE}`,
      }
    },
  },      
  plugins: [
    'serverless-webpack', 
    'serverless-dynamodb-local', 
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x', //needs to be 10.x for local, 14.x for AWS
    region: 'ap-southeast-2',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      SLS_A_REGION: '${self:custom.environment.SLS_A_REGION.${self:custom.stage}}',
      SLS_A_ENDPOINT: '${self:custom.environment.SLS_A_ENDPOINT.${self:custom.stage}}',
      SLS_A_ACCESS_KEY_ID: '${self:custom.environment.SLS_A_ACCESS_KEY_ID.${self:custom.stage}}',
      SLS_A_SECRET_ACCESS_KEY: '${self:custom.environment.SLS_A_SECRET_ACCESS_KEY.${self:custom.stage}}',
      AUTH_EXPIRY: '${self:custom.environment.AUTH_EXPIRY.${self:custom.stage}}',
      JWT_SECRET: '${self:custom.environment.JWT_SECRET.${self:custom.stage}}',
      API_ACCESS: '${self:custom.environment.API_ACCESS.${self:custom.stage}}',
      DB_SEEDS_PATH: '${self:custom.environment.DB_SEEDS_PATH.${self:custom.stage}}',
      QUEUES: '${self:custom.environment.QUEUES.${self:custom.stage}}',
      STAGE: '${self:custom.stage}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchGetItem',
          'dynamodb:BatchWriteItem',
        ],
        Resource: 'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/*',
      },
    ],
    profile: 'immutablex-serverless',
  },
  functions: {
    authPost: {
      handler: 'platform-service/api/auth.post',
      events: [
        {
          http: {
            method: 'post',
            path: '/auth',
          },
        },
      ]
    },
    userGet: {
      handler: 'platform-service/api/user.get',
      events: [
        {
          http: {
            method: 'get',
            path: '/user/{id}',
          },
        },
      ]
    },
    userSeed: {
      handler: 'platform-service/api/user.seed',
      events: [
        {
          http: {
            method: 'post',
            path: '/user/seed',
          },
        },
      ]
    },
    orderSeed: {
      handler: 'platform-service/api/order.seed',
      events: [
        {
          http: {
            method: 'post',
            path: '/order/seed',
          },
        },
      ]
    },
    orderList: {
      handler: 'platform-service/api/order.list',
      events: [
        {
          http: {
            method: 'get',
            path: '/order/list/{type}/{status}',
          },
        },
      ]
    },
    orderGet: {
      handler: 'platform-service/api/order.get',
      events: [
        {
          http: {
            method: 'get',
            path: '/order/{id}',
          },
        },
      ]
    },
    orderPurchase: {
      handler: 'platform-service/api/order.purchase',
      events: [
        {
          http: {
            method: 'post',
            path: '/order/purchase',
          },
        },
      ]
    },
    orderCreateTrigger: {
      handler: 'platform-service/api/order.createOrderTrigger',
      events: [
        {
          http: {
            method: 'post',
            path: '/order/create',
          },
        },
      ]
    },
    orderCreateQueue: {
      handler: 'platform-service/api/order.createOrderQueue',
      events: [
        {
          sqs: {
            arn: 'arn:aws:sqs:ap-southeast-2:364446779608:CreateOrder-${self:custom.environment.QUEUE_STAGE.${self:custom.stage}}'
          }
        },
      ]
    },
    tradeCompleteTrigger: {
      handler: 'platform-service/api/trade.completeTradeTrigger',
      events: [
        {
          http: {
            method: 'post',
            path: '/trade/complete',
          },
        },
      ]
    },
    tradeCompleteQueue: {
      handler: 'platform-service/api/trade.completeTradeQueue',
      events: [
        {
          sqs: {
            arn: 'arn:aws:sqs:ap-southeast-2:364446779608:CompleteTrade-${self:custom.environment.QUEUE_STAGE.${self:custom.stage}}'
          }
        },
      ]
    },
    tradeCreateTrigger: {
      handler: 'platform-service/api/trade.createTradeTrigger',
      events: [
        {
          http: {
            method: 'post',
            path: '/trade/create',
          },
        },
      ]
    },
    tradeCreateQueue: {
      handler: 'platform-service/api/trade.createTradeQueue',
      events: [
        {
          sqs: {
            arn: 'arn:aws:sqs:ap-southeast-2:364446779608:CreateTrade-${self:custom.environment.QUEUE_STAGE.${self:custom.stage}}'
          }
        },
      ]
    },
    paymentCreateTrigger: {
      handler: 'platform-service/api/payment.createPaymentTrigger',
      events: [
        {
          http: {
            method: 'post',
            path: '/payment/create',
          },
        },
      ]
    },
    paymentCreateQueue: {
      handler: 'platform-service/api/payment.createPaymentQueue',
      events: [
        {
          sqs: {
            arn: 'arn:aws:sqs:ap-southeast-2:364446779608:CreatePayment-${self:custom.environment.QUEUE_STAGE.${self:custom.stage}}'
          }
        },
      ]
    },
    assetSeed: {
      handler: 'platform-service/api/asset.seed',
      events: [
        {
          http: {
            method: 'post',
            path: '/asset/seed',
          },
        },
      ]
    }
  },
  resources: {
    Resources: {
      User: UserTable(process.env.DBSTAGE),
      Order: OrderTable(process.env.DBSTAGE),
      Asset: AssetTable(process.env.DBSTAGE),
      Trade: TradeTable(process.env.DBSTAGE),
      Payment: PaymentTable(process.env.DBSTAGE),
    }
  }
}

module.exports = serverlessConfiguration
