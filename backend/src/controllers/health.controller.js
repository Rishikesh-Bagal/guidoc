const checkHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'GUIDOC API is running'
  });
};

module.exports = {
  checkHealth,
};
