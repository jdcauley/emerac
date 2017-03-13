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



app.get('/', (req, res) => {
  res.status(200).json({
    apiStatus: 'ok'
  });
});

app.get('/api/v1/routes', (req, res) => {
  
  res.status(200).json({
    endpoints: app._router.stack.filter(r => r.route).map(r => r.route.path)
  })
})


// User Routes
app.post( apiPrefix + '/users', Controllers.user.create );
app.get( apiPrefix + '/users', expressJwt({secret: jwtSecret}), Controllers.user.find );
app.get( apiPrefix + '/users/:id', expressJwt({secret: jwtSecret}), Controllers.user.findById );
app.put( apiPrefix + '/users', expressJwt({secret: jwtSecret}), Controllers.user.update);
app.delete( apiPrefix + '/api/v1/users/:id', expressJwt({secret: jwtSecret}), Controllers.user.destroy );

// Auth Routes
app.post( apiPrefix + '/auth', Controllers.auth.login );
app.get( apiPrefix + '/auth/verify/:token', Controllers.auth.verifyEmail );
app.post( apiPrefix + '/auth/password/reset/start', Controllers.auth.startPasswordReset );
app.get( '/password/reset/:token', Controllers.auth.renderForm );
app.post( apiPrefix + '/auth/password/reset/', Controllers.auth.savePasswordReset );


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