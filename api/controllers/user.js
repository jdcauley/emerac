console.log('users');

const UserController = {};

UserController.create = (req, res) => {

  const User = req.app.models.user;

  User.create(req.body, function(err, user){
    
    if( err ){
      res.status(500).json({
        error: err
      });
    }

    if(user){
      res.status(201).json({
        user: user
      });
    }

  });
};

UserController.find = (req, res) => {
  const User = req.app.models.user;

  var findQuery = User.find();

  findQuery.exec(function(err, users){
    
    if( err ){
      res.status(500).json({
        error: err
      });
    }

    if(users){
      res.status(200).json({
        users: users
      });
    }

  });
};

module.exports = UserController;