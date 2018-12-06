const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
let JWT_SECRET = process.env.JWT_SECRET || 'use-this-or-gen-new-secret'
let ROOT_URL = process.env.ROOT_URL || 'http://localhost:3000'
const AuthController = {}

AuthController.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(500).json({
      error: 'All Fields are Required'
    })
  }

  const User = req.app.models.User

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(function (user) {
      bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
        if (err) {
          return res.status(401).json({error: err})
        }
        if (isMatch) {
          const token = jwt.sign({
            email: user.email,
            id: user.id
          }, JWT_SECRET)

          return res.status(201).json({
            auth: {
              id: token,
              user_id: user.id
            }
          })
        } else {
          return res.status(401).json({
            error: 'That password doesn\'t look right to me'
          })
        }
      })
    })
    .catch(function (err) {
      return res.status(401).json({error: err})
    })
}

AuthController.startPasswordReset = (req, res) => {
  const User = req.app.models.User
  let userEmail = req.body.email

  User.findOne({email: userEmail})
    .then(function (user) {
      const emailToken = jwt.sign({
        userEmail: user.email,
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
      }, JWT_SECRET)

      req.app.Services.mailer.send({
        'From': process.env.SENDING_ADDRESS || 'test@mail.com',
        'To': user.email,
        'Subject': 'Reset Your Password',
        'TextBody': '<a href="' + ROOT_URL + '/password/reset/' + emailToken + '>Click here to reset your Email</a>'
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
  return res.render('pages/password-reset', {
    token: req.params.token
  })
}

AuthController.savePasswordReset = (req, res) => {
  let token = req.body.token
  let pass = req.body.password
  let confirm = req.body.confirmation
  let decoded = jwt.verify(token, JWT_SECRET)

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
