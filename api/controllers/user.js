const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

var postmark = require("postmark");
var mailer = new postmark.Client(process.env.POSTMARK_KEY);

const UserController = {};

UserController.create = (req, res) => {

  const User = req.app.models.User;

  User.create(req.body)
    .then(function(user){
      res.status(201).json({
        user: user
      });
    })
    .catch(function(err){
      res.status(500).json({
        error: err
      });
    })

};

UserController.update = (req, res) => {
  
  var User = req.app.models.user;

  User.update(req.user.id, req.body, function(err, updatedUser){
    if(err){
      res.status(500).json(err);
    }
    if(updatedUser){
      res.status(200).json({
        user: updatedUser[0]
      });
    }
  });

};

UserController.find = (req, res) => {

  const sequelize = req.app.models.sequelize
  const User = req.app.models.User;

  // User.findAll({})
  //   .then(function(users){
  //     res.status(201).json({
  //       users: users
  //     });
  //   })
  //   .catch(function(err){
  //     res.status(500).json({
  //       error: err
  //     });
  //   })
  let query = 'SELECT * FROM "Users" AS "User"'

  sequelize.query(query, { model: User })
    .then(function(users){
      res.status(201).json({
        user: users
      });
    }).catch(function(err){
      res.status(500).json({
        error: err
      });
    })

  // const User = req.app.models.user;

  // var findQuery = User.find();

  // findQuery.exec(function(err, users){
    
  //   if( err ){
  //     res.status(500).json({
  //       error: err
  //     });
  //   }

  //   if(users){
  //     res.status(200).json({
  //       users: users
  //     });
  //   }

  // });
};

UserController.findById = (req, res) => {

  var User = req.app.models.user;

  User.findOne({id: req.params.id}, function(err, user){
    if(err){
      res.status(500).json(err);
    }
    if(user){

      res.status(200).json({
        user: user
      });
    }
  });

};

UserController.destroy = (req, res) => {

  var User = req.app.models.user;

  User.destroy({id: req.params.id}, function(err, user){
    if(err){
      res.status(500).json(err);
    }
    if(user){

      res.status(200).json({
        removed: user
      });
    }
  });

};

module.exports = UserController;