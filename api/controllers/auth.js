const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;

var postmark = require("postmark");
var mailer = new postmark.Client(process.env.POSTMARK_KEY);

const AuthController = {};

AuthController.login = (req, res) => {

  if (!req.body.email || !req.body.password ) {
    
    res.status(500).json({
      error: 'All Fields are Required'
    });
  }

  var User = req.app.models.user;

  User.findOne({email: req.body.email}, function(err, user){

    if(err){
      
      res.status(500).json({error: err});
    }

    if(user){

      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if(err){
          res.status(500).json({error: err});
        }
        if(isMatch){

          const token = jwt.sign({
            email: user.email,
            id: user.id
          }, jwtSecret);

          res.status(200).json({
            id: token,
            user_id: user.id
          });
        } else {
          res.status(400).json({
            error: 'That password doesn\'t look right to me'
          });
        }
      });
    } else {
      res.status(400).json({
        error: 'Looks like we can find you, have you signed up?'
      });
    }
  });

};

AuthController.verifyEmail = (req, res) => {

  var token = req.params.token;
  var decoded = jwt.verify(token, jwtSecret);

  var User = req.app.models.user;

  User.update(decoded.id, {emailVerified: true}, function(err, updatedUser){
    
    if(err){
      res.status(500).json({error: err});
    }

    if(updatedUser){
      res.status(200).json({user: updatedUser});
    } else {
      res.status(400).json({error: 'Looks like we can find you, have you signed up?'});
    }


  });

};

AuthController.startPasswordReset = (req, res) => {
  
  var User = req.app.models.user;

  var userEmail = req.body.email;

  User.findOne({email: userEmail}, function(err, user){
    if(err){
      return res.status(500).json({
        error: err
      });
    }
    if(user){

      const emailToken = jwt.sign({
        userEmail: user.email,
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
      }, jwtSecret);
      
      mailer.sendEmail({
        "From": "jordan@cauley.co",
        "To": user.email,
        "Subject": "Reset Your BeerNC Password", 
        "TextBody": '<a href="' + process.env.ROOT_URL + '/password/reset/' + emailToken + '>Click here to reset your Email</a>'
      });

      return res.status(200).json({
        reset: 'running'
      });

    } else {

      return res.status(500).json({
        error: 'Looks like we can find you, have you signed up?'
      });

    }
  
  });

};

AuthController.renderForm = (req, res) => {

  res.render('pages/password-reset', {
    token: req.params.token
  });

};

AuthController.savePasswordReset = (req, res) => {

  var token = req.body.token;
  var pass = req.body.password;
  var confirm = req.body.confirmation;
  var decoded = jwt.verify(token, jwtSecret);

  var User = req.app.models.user;

  if(pass != confirm){
    return res.json({
      nope: 'That password doesn\'t look right to me'
    });
  }

  User.update(decoded.id, {password: pass}, function(err, updatedUser){

    if(err){
      res.status(500).json({error: err});
    }

    if(updatedUser){
      res.status(200).json({
        user: updatedUser
      });
    } else {
      res.status(400).json({
        error: 'Looks like we can find you, have you signed up?'
      });
    }

  });




};

module.exports = AuthController;