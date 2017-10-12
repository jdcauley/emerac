require('dotenv').config()

const routes = require('./config/routes.js')
var app = require('./config/boot.js')
app.apiPrefix = '/api/v1'
app = routes(app)

var port = process.env.PORT || 3000

module.exports = app.listen(port, () => {
  console.log('serving: http://localhost:' + port)
})