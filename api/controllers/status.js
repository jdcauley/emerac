const StatusController = {};

StatusController.find = (req, res) => {
  
  const models = req.app.models.User;

  res.status(200).json({
    apiStatus: 'ok'
  });

}

module.exports = StatusController;