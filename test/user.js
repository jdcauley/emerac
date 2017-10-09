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
  let email = faker.Internet.email()
  let response = null

  before((done) => { //Before each test we empty the database
    return done()
  });

  /*
  * Test the /POST route
  */

  describe('/POST user', () => {

    before((done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          "username": username,
          "email": email,
          "password": "password123"
        }).end((err, res) => {
          response = res
          return done()
        })
    })
      
    it('it should have STATUS 201', (done) => {
      response.should.have.status(201)
      return done()
    })

    it('it should CREATE a USER', (done) => {
      response.body.should.have.property('user')
      response.body.user.should.have.property('id')
      response.body.user.should.have.property('username')
      response.body.user.should.have.property('email')
      return done()
    })

    it('it should CREATE an AUTH', (done) => {
      response.body.should.have.property('user')
      return done()
    })

  })

  /*
  * Test the /GET route
  */

  describe('/GET user', () => {
    before((done) => {
      chai.request(server)
        .get('/api/v1/users')
        .end((err, res) => {
          response = res
          return done()
        })
    })

    it('it should have STATUS 200', (done) => {
      response.should.have.status(200)
      return done()
    })

    it('it should GET all users', (done) => {
      response.body.should.be.a('object')
      response.body.users.should.be.a('array')
      response.body.users.should.have.length(1)
      return done()
    })
  })

  after( function(done) {
    console.log('Done')
    User.destroy({
      where: {},
      truncate: true
    }).then((user) => {
      return done()
    })
    .catch((err) => {
      console.log(err)
      return done()
    })
  }); 

})