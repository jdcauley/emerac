const fs = require('fs')
const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const routes = require('./routes.js')
const secret = process.env.JWT_SECRET || 'use-this-or-gen-new-secret'
const sessionConfig = {
  secret,
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000
  }
}
if (process.env.NODE_ENV === 'production') {
  sessionConfig.cookie.secure = true
}
// fetch controllers
const Models = require('../db.js')

module.exports = async () => {

  let app = express()

  app.set('view engine', 'ejs')
  app.set('trust proxy', 1)

  app.use('/assets', express.static(path.resolve('assets')))
  app.use(session(sessionConfig))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
  })
  app.use((req, res, next) => {
    // if there's a flash message in the session request, make it available in the response, then delete it
    if (req.session && req.session.flash) {
      req.session.flash = []
    }
    next();
  })

  try {
    const Controllers = {}
    const Services = {}

    let controllerPath = path.join(__dirname, '../api/controllers')
    let servicesPath = path.join(__dirname, '../api/services')

    fs.readdirSync(controllerPath).forEach((file) => {
      var fileName = file.split('.')
      if (fileName[0] === 'tests') {
        return
      }
      Controllers[fileName[0]] = require('../api/controllers/' + file)
    })

    fs.readdirSync(servicesPath).forEach((file) => {
      var fileName = file.split('.')
      if (fileName[0] === 'tests') {
        return
      }
      Services[fileName[0]] = require('../api/services/' + file)
    })

    app.models = await Models()
    app.services = Services
    app.controllers = Controllers

    app.apiPrefix = '/api/v1'
    app = routes(app)

    return app
  } catch(err) {
    throw err
  }

}
