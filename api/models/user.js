var bcrypt = require('bcrypt');

var User = {
  identity: 'user',
  attributes: {

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    username: {
      type: 'string',
      required: true,
      unique: true
    },

    name: {
      type: 'string'
    },

    emailVerified: {
      type: 'boolean', 
      default: false
    },

    password: {
      type: 'string',
      required: true
    },

    bookmarks: {
      collection: 'bookmark',
      via: 'users',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.avatarData;
      return obj;
    }   
  },

  beforeCreate: function(values, next){

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);

        values.password = hash;
        next();
      });
    });
  },
  beforeUpdate: function(values, next){

    if(!values.password){
      return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);

        values.password = hash;
        next();
      });
    });
  },
  comparePassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
};

module.exports = User;