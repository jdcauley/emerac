const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes, Sequelize) => {

  class User extends Sequelize.Model {}

  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, { 
    sequelize,
    hooks: {
      beforeCreate: async(user, options) => {
        return await bcrypt.hash(user.password, 10).then(function (hash) {
          user.password = hash
        })
      }
    },
    modelName: 'User',
  })

  User.prototype.toJSON = function () {
    const {
      password,
      ...values
    } = this.get()

    return values
  }

  return User
}
