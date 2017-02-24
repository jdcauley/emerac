require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

var SALT_WORK_FACTOR = 10;
const expressJwt = require('express-jwt');
const jwtSecret = '0a6b944d-d2fb-46fc-a85e-0295c986cd9f';

Promise = require('bluebird');

// fetch controllers

const controllers = {};

console.log(__dirname);

var normalizedPath = path.join(__dirname, 'api/controllers');

fs.readdirSync(normalizedPath).forEach(function(file) {
  var fileName = file.split('.');
  controllers[fileName[0]] = require("./api/controllers/" + file);
});

console.log(controllers);

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

app.post(apiPrefix + '/users', controllers.user.create);

app.get('*', function(req, res){

  res.status(404).render('pages/404');

});


// models.waterline.initialize(models.config, function(err, models) {
//   if(err) throw err;
//   // console.log(models.collections);
//   app.models = models.collections;
//   app.connections = models.connections;
 
//   // Start Server
//   var port = process.env.PORT || 3000;

//   app.listen(port, () => {
//     console.log('serving');
//   });

// });

var port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('serving');
  });