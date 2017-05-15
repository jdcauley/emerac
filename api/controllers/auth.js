const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const jwtSecret = process.env.JWT_SECRET

var postmark = require('postmark')
var mailer = new postmark.Client(process.env.POSTMARK_KEY)

const AuthController = {}

AuthController.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(500).json({
      error: 'All Fields are Required'
    })
  }

  var User = req.app.models.User

  User.findOne({email: req.body.email})
    .then(function (user) {
      bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
        if (err) {
          return res.status(500).json({error: err})
        }
        if (isMatch) {
          const token = jwt.sign({
            email: user.email,
            id: user.id
          }, jwtSecret)

          return res.status(200).json({
            id: token,
            user_id: user.id
          })
        } else {
          return res.status(400).json({
            error: 'That password doesn\'t look right to me'
          })
        }
      })
    })
    .catch(function (err) {
      return res.status(500).json({error: err})
    })
}

AuthController.startPasswordReset = (req, res) => {
  var User = req.app.models.User

  var userEmail = req.body.email

  User.findOne({email: userEmail})
    .then(function (user) {
      const emailToken = jwt.sign({
        userEmail: user.email,
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
      }, jwtSecret)

      mailer.sendEmail({
        'From': 'jordan@cauley.co',
        'To': user.email,
        'Subject': 'Reset Your BeerNC Password',
        'TextBody': '<a href="' + process.env.ROOT_URL + '/password/reset/' + emailToken + '>Click here to reset your Email</a>'
      })

      return res.status(200).json({
        reset: 'running'
      })
    })
    .catch(function (err) {
      return res.status(500).json({
        error: err
      })
    })
}

AuthController.renderForm = (req, res) => {
  res.render('pages/password-reset', {
    token: req.params.token
  })
}

AuthController.savePasswordReset = (req, res) => {
  let token = req.body.token
  let pass = req.body.password
  let confirm = req.body.confirmation
  let decoded = jwt.verify(token, jwtSecret)

  var User = req.app.models.User

  if (pass !== confirm) {
    return res.json({
      nope: 'That password doesn\'t look right to me'
    })
  }

  User.update({password: pass}, {
    where: {
      id: decoded.user.email
    }
  })
  .then((user) => {
    return res.status(200).json({
      user: user
    })
  })
  .catch(function (err) {
    return res.status(500).json({error: err})
  })
}

module.exports = AuthController
