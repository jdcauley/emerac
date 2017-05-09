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
  
  const User = req.app.models.User;

  User.update(req.body, {
      where: {
        id: req.user.id
      }
    })
    .then(function(user){
      return res.status(200).json({
        user: user
      })
    })
    .catch(function(err){
      return res.status(500).json(err)
    })

}

UserController.find = (req, res) => {

  const User = req.app.models.User;

  User.findAll({})
    .then(function(users){
      res.status(201).json({
        users: users
      });
    })
    .catch(function(err){
      res.status(500).json({
        error: err
      });
    })
}

UserController.findById = (req, res) => {
  const User = req.app.models.User;

  User.findOne({id: req.params.id})
    .then(function(user){
      return res.status(200).json({
        user: user
      })
    })
    .catch(function(err){
      return res.status(500).json(err)
    })
}

UserController.destroy = (req, res) => {

  var User = req.app.models.User;

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