console.log('users');

const UserController = {};

UserController.create = (req, res) => {

  res.status(201).json({
    user: 'new'
  });
}

module.exports = UserController;