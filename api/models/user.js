const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
  })

  User.prototype.toJSON = function() {
    const {
      password,
      ...values
    } = this.get()

    return values
  }
  
  User.beforeCreate((user, options) => {	
    return bcrypt.hash(user.password, 10).then(function(hash) {	
      user.password = hash;	
    })	
  })

  return User
}
