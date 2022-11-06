
import { expect } from 'chai'
import { UserController } from '../../controllers/user.controller'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserModel } from '../../models/user.model';
import { SeedOptions } from '../../controllers/_base.controller';

const isTest = process.env.JEST_WORKER_ID;

const config = {
  convertEmptyValues: true,
  ...(isTest && { 
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

const ddb = new DocumentClient(config);

describe('User Controller Tests', function() {  

  describe('d01 - getUserById', function() {

    it('s01 - should seed the test user database', async function() {

      const userController:UserController = new UserController()

      const userModel:UserModel = new UserModel(ddb)
      const seedOptions:SeedOptions = {model: userModel, file: 'user.json', name: 'user'}
      const seedResult = await userController.seed(seedOptions)

      expect(seedResult.error).to.not.exist
      expect(seedResult.data.items.length).to.equal(2)

      //results are not returned in a reliable order
      const ryanIndex = seedResult.data.items.findIndex((it) => it.email === 'ryanengelhardt@test.com')
      const craigIndex = seedResult.data.items.findIndex((it) => it.email === 'craigmacgregor@test.com')

      expect(ryanIndex).to.be.oneOf([0,1])
      expect(craigIndex).to.be.oneOf([0,1])

      expect(seedResult.data.items[ryanIndex].password).to.equal('qwer')
      expect(seedResult.data.items[craigIndex].password).to.equal('1234')

    })

    it('s01 - should fetch a user from the database and strip the password', async function() {

      const userController:UserController = new UserController()
      const userModel:UserModel = new UserModel(ddb)

      const userResult = await userController.getUser('craigmacgregor@test.com', userModel, userModel.getByEmail)
 
      expect(userResult.error).to.not.exist
      expect(userResult.data.user.email).to.equal('craigmacgregor@test.com')
      expect(userResult.data.user.password).to.not.exist
     })

  })

})