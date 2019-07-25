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
      console.log(file)
      console.log(path.join(normalizedPath, file))
      const modelFunction = require(path.join(normalizedPath, file))
      
      const result = modelFunction(sequelize, Sequelize.DataTypes, Sequelize)

      db[result.name] = result
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
