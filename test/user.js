process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index.js')
let should = chai.should()
let faker = require('faker')

const Models = require('../db.js')
const User = Models.User

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {

  let username = faker.Internet.userName()
  let email = faker.Internet.email();
    // beforeEach((done) => { //Before each test we empty the database
    //     User.destroy({
    //       where: {},
    //       truncate: true
    //     })
    // });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all users', (done) => {
        chai.request(server)
            .get('/api/v1/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.users.should.be.a('array')
              done()
            })
      })
  })

  describe('/POST user', () => {
      it('it should Create a USER', (done) => {
        chai.request(server)
            .post('/api/v1/users')
            .send({
              "username": username,
              "email": email,
              "password": "password123"
            })
            .end((err, res) => {
                chai.expect(res).to.be.json
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.body.should.have.property('auth')
                res.body.should.have.property('user')
                res.body.user.should.have.property('id')
                res.body.user.should.have.property('username')
                res.body.user.should.have.property('email')
              done();
            })
      })
  })

})