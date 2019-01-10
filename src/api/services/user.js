const jwt = require('jsonwebtoken')
let JWT_SECRET = process.env.JWT_SECRET || 'use-this-or-gen-new-secret'

const UserServices = {}

UserServices.generateNewToken = data => jwt.sign(data, JWT_SECRET)

UserServices.readToken = token => jwt.verify(token, JWT_SECRET)

module.exports = UserServices
