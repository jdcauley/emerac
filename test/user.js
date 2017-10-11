process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let faker = require('faker')

let server = require('../index.js')
const Models = require('../db.js')
const User = Models.User

chai.use(chaiHttp)

describe('Users', () => {
  let username = faker.Internet.userName()
  let email = faker.Internet.email()
  let updatedEmail = faker.Internet.email()
  let response = null
  let userID = null
  let auth = null

  /*
  * Test the /POST route
  */

  describe('POST users', () => {
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

    it(`it should have STATUS 201`, () => {
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

    describe('GET user by ID', () => {
      before((done) => {
        userID = response.body.user.id
        auth = response.body.auth.id
        chai.request(server)
          .get(`/api/v1/users/${response.body.user.id}`)
          .set(`Authorization`, `bearer ${auth}`)
          .end((err, res) => {
            response = res
            return done()
          })
      })

      it('it should have STATUS 200', () => {
        response.should.have.status(200)
      })

      it(`it should get one USER`, () => {
        response.body.should.be.a('object')
        response.body.user.should.be.a('object')
        response.body.user.should.have.property('id', userID)

      })

    })

  /*
  * Test the PUT route
  */

  describe('Put user', () => {
    before((done) => {
      chai.request(server)
        .put('/api/v1/users')
        .set(`Authorization`, `bearer ${auth}`)
        .send({
          email: updatedEmail
        })
        .end((err, res) => {
          response = res
          return done()
        })

    })

    it('it should have STATUS 200', () => {
      response.should.have.status(200)
    })

    it('it should UPDATE USER', () => {
      response.body.user.should.have.property('email', updatedEmail)
    })


  })

  /*
  * Test the GET route
  */

  describe('GET users', () => {
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
