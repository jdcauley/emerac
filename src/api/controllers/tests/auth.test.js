process.env.NODE_ENV = 'test'
const request = require('supertest')
const fs = require('fs')
const path = require('path')

const faker = require('faker')
const boot = require('../../../app.js')
let server = null
let response = null
let token = null

const userEmail = faker.internet.email()
const userPass = faker.internet.password()

beforeAll(async() => {
  await boot.then( async (app) => {
    const port = process.env.PORT || 3000
    const host = process.env.ROOT_URL || 'http://localhost'
    server = app
    const user = await server.models.User.create({
      email: userEmail,
      password: userPass,
    })
    return
  })

});

describe('Successful Auth Token Generation', () => {
  describe('Authorization return 201', () => {
    beforeAll(async () => {
      response = await request(server)
        .post(`/api/v1/auth`)
        .send({
          email: userEmail,
          password: userPass,
        })
      token = response.body.auth.id
    })

    it('should return a 201', () => {
      expect(response.status).toBe(201)
    })

    it('should have an auth property', () => {
      expect(response.body).toHaveProperty('auth')
      expect(response.body.auth).toHaveProperty('id')
    })
  })
})

describe('Invalid Auth Attempt', () => {
  describe('Invalid Password', () => {
    beforeAll(async () => {
      response = await request(server)
        .post(`/api/v1/auth`)
        .send({
          email: userEmail,
          password: faker.internet.password()
        })
    })

    it('should return a 401', () => {
      expect(response.status).toBe(401)
    })

    it('should have an error property', () => {
      expect(response.body).toHaveProperty('error')
    })

  })

  describe('Missing Fields', () => {
    beforeAll(async () => {
      response = await request(server)
        .post(`/api/v1/auth`)
        .send({
          email: faker.internet.email()
        })
    })

    it('should return a 400', () => {
      expect(response.status).toBe(400)
    })

    it('should have an error property', () => {
      expect(response.body).toHaveProperty('error')
    })

  })

  describe('Invalid User', () => {
    beforeAll(async () => {
      response = await request(server)
        .post(`/api/v1/auth`)
        .send({
          email: faker.internet.email(),
          password: faker.internet.password()
        })
    })

    it('should return a 404', () => {
      expect(response.status).toBe(404)
    })

    it('should have an error property', () => {
      expect(response.body).toHaveProperty('error')
    })

  })
})

afterAll( async() => {
  const testDB = path.join(__dirname, '../../../test.sqlite')
  if (fs.existsSync(testDB)) {
    fs.unlinkSync(testDB)
  }
})