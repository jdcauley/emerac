require('dotenv').config()
const boot = require('./app')

boot.then((app) => {
  const port = process.env.PORT || 3000
  const host = process.env.ROOT_URL || 'http://localhost'
  app.root_dir = __dirname
  app.listen(port, () => {
    console.log( `serving:${host}`)
  })
})