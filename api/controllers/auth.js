const bcrypt = require('bcrypt')
let ROOT_URL = process.env.ROOT_URL || 'http://localhost:3000'
const AuthController = {}

AuthController.login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: 'All Fields are Required'
    })
  }

  try {
    const user = await req.app.models.User.findOne({
      where: {
        email: {
          $eq: req.body.email
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        error: 'No user with this email address was found'
      })
    }

    const match = await bcrypt.compare(req.body.password, user.password)
    
    if (!match) {
      return res.status(401).json({
        error: 'Email or Password does not match'
      })
    }

    const userToken = req.app.services.user.generateNewToken({
      id: user.id,
      email: user.email,
    })

    return res.status(201).json({
      auth: {
        id: userToken,
        user_id: user.id
      }
    })

  } catch(err) {
    return res.status(500).json({
      error: err
    })
  }

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
  return res.render('auth/password-reset', {
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
