const fs = require('fs')
const path = require('path')
const {
  sequelize,
  Sequelize,
} = require('./config/orm')

module.exports = async () => {
  const db = {}

  const normalizedPath = path.join(__dirname, 'api/models')

  try {
    fs.readdirSync(normalizedPath).forEach((file) => {
      const model = sequelize.import(path.join(normalizedPath, file))
      db[model.name] = model
    })
  
    Object.keys(db).forEach((modelName) => {
      if ('associate' in db[modelName]) {
        db[modelName].associate(db)
      }
    })
  
    await sequelize.sync({ force: false })
  
    db.sequelize = sequelize
    db.Sequelize = Sequelize
  
    return db
  } catch(err) {
    throw err
  }
}
