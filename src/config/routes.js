const expressJwt = require('express-jwt')
let JWT_SECRET = process.env.JWT_SECRET || 'use-this-or-gen-new-secret'

module.exports = (app) => {

  const apiPrefix = app.apiPrefix

  // User Routes
  app.post(`${apiPrefix}/users`, app.controllers.user.create)
  app.get(apiPrefix + '/users', expressJwt({secret: JWT_SECRET, credentialsRequired: false}), app.controllers.user.find)
  app.get(apiPrefix + '/users/:id', expressJwt({secret: JWT_SECRET}), app.controllers.user.findById)
  app.patch(apiPrefix + '/users', expressJwt({secret: JWT_SECRET}), app.controllers.user.update)
  app.put(apiPrefix + '/users', expressJwt({secret: JWT_SECRET}), app.controllers.user.update)
  app.delete(apiPrefix + '/users', expressJwt({secret: JWT_SECRET}), app.controllers.user.destroy)

  // Auth Routes
  app.post(apiPrefix + '/auth', app.controllers.auth.login)
  app.post(apiPrefix + '/auth/password/reset/start', app.controllers.auth.startPasswordReset)
  app.get('/password/reset/:token', app.controllers.auth.renderForm)
  app.post(apiPrefix + '/auth/password/reset/', app.controllers.auth.savePasswordReset)

  app.get(apiPrefix + '/routes', (req, res) => {
    return res.status(200).json({
      endpoints: app._router.stack.filter(r => r.route).map(r => r.route.path)
    })
  })
  
  app.get(apiPrefix + '/status', (req, res) => {
    return res.status(200).json({
      apiStatus: 'ok'
    })
  })

  app.get('*', (req, res) => {
    return res.status(404).render('404', {
      session: req.session
    })
  })

  return app
}