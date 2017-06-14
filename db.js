const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
let sequelize = null

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL)
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
  })
}

var db = {}

var normalizedPath = path.join(__dirname, 'api/models')

fs.readdirSync(normalizedPath).forEach((file) => {
  var model = sequelize.import(path.join(normalizedPath, file))
  db[model.name] = model
})

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

sequelize
.sync({ force: false })
.then(() => {
  console.log('DB Connection Success')
})
.catch((err) => {
  console.log('DB Error')
  console.log(err)
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
