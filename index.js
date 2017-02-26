require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

var SALT_WORK_FACTOR = 10;
const expressJwt = require('express-jwt');
const jwtSecret = process.env.JWT_SECRET;

Promise = require('bluebird');

// fetch controllers
const Models = require('./db.js');
const Controllers = {};

var normalizedPath = path.join(__dirname, 'api/controllers');

fs.readdirSync(normalizedPath).forEach(function(file) {
  var fileName = file.split('.');
  Controllers[fileName[0]] = require("./api/controllers/" + file);
});


var apiPrefix = '/api/v1';
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});



app.get('/', function(req, res){
  res.status(200).json({apiStatus: 'ok'});
});

// User Routes
app.post(apiPrefix + '/users', Controllers.user.create);
app.get(apiPrefix + '/users', Controllers.user.find);

app.get('*', function(req, res){

  res.status(404).render('pages/404');

});


Models.waterline.initialize(Models.config, function(err, models) {
  if(err) throw err;

  app.models = models.collections;
  app.connections = models.connections;
 
  var port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('serving: http://localhost:' + port);
  });

});