const StatusController = {}

StatusController.find = (req, res) => {
  return res.status(200).json({
    apiStatus: 'ok'
  })
}

module.exports = StatusController
