const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

// fetch controllers
const Models = require('../db.js')
const Controllers = {}
const Services = {}

let controllerPath = path.join(__dirname, '../api/controllers')
let servicesPath = path.join(__dirname, '../api/services')

fs.readdirSync(controllerPath).forEach((file) => {
  var fileName = file.split('.')
  Controllers[fileName[0]] = require('../api/controllers/' + file)
})

fs.readdirSync(servicesPath).forEach((file) => {
  var fileName = file.split('.')
  Services[fileName[0]] = require('../api/services/' + file)
})

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.models = Models
app.services = Services
app.controllers = Controllers

module.exports = app
