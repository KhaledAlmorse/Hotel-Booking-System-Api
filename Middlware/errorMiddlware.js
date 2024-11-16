const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const globalError = (err, req, res, next) => {
  // if (return res.headersSent) {
  //   return next(err); // If headers are already sent, delegate to default error handler
  // }
  sendErrorForDev(err, res);
};

module.exports = globalError;
