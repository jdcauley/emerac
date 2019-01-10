const Sequelize = require('sequelize')

function generateORM() {
  let logging = false

  if (process.env.NODE_ENV === 'test') {
    return {
      sequelize: new Sequelize({
        dialect: 'sqlite',
        storage: './test.sqlite',
        logging,
      }), 
      Sequelize,
    }
  }

  if (process.env.NODE_ENV === 'development') {
    logging = true
  }

  if (process.env.DATABASE_URL) {
    const dialectOptions = {}
  
    if (process.env.SSL_STATUS) {
      dialectOptions.ssl = true
    }

    return {
     sequelize: new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions,
        logging
      }),
      Sequelize,
    }
  }

  return {
    sequelize: new Sequelize({
      dialect: 'sqlite',
      storage: './db.sqlite',
      logging
    }),
    Sequelize,
  } 

}


module.exports = generateORM()