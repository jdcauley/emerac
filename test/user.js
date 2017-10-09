process.env.NODE_ENV = 'test'

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index.js')
let should = chai.should()
let faker = require('faker')

const Models = require('../db.js')
const User = Models.User

chai.use(chaiHttp)
// Our parent block
describe('Users', () => {
  let username = faker.Internet.userName()
  let email = faker.Internet.email()
  let response = null

  /*
  * Test the /POST route
  */

  describe('/POST user', () => {
    before((done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          'username': username,
          'email': email,
          'password': 'password123'
        }).end((err, res) => {
          response = res
          return done()
        })
    })

    it('it should have STATUS 201', () => {
      response.should.have.status(201)
    })

    it('it should CREATE a USER', () => {
      response.body.should.have.property('user')
      response.body.user.should.have.property('id')
      response.body.user.should.have.property('username')
      response.body.user.should.have.property('email')
    })

    it('it should CREATE an AUTH', () => {
      response.body.should.have.property('user')
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

    it('it should have STATUS 200', () => {
      response.should.have.status(200)
    })

    it('it should GET all users', () => {
      response.body.should.be.a('object')
      response.body.users.should.be.a('array')
      response.body.users.should.have.length(1)
    })
  })

  after(function (done) {
    User.destroy({
      where: {},
      truncate: true
    }).then((user) => {
      return done()
    })
    .catch((err) => {
      return done()
    })
  })

})
