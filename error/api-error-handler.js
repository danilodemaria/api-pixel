const ApiError = require('./ApiError');
const logger = require('../utils/logger');

// eslint-disable-next-line
const apiErrorHandler = async (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message);
  }
  logger.error(
    `Unknown API Error - 
     Error code: ${err.code} - 
     Error message: ${err.message} -
     Request body: ${JSON.stringify(req.body, null, 4)} -
     Request headers: ${JSON.stringify(req.headers, null, 4)} -
     Request base url: ${req.baseUrl} - 
     Complete error: ${JSON.stringify(err, null, 4)}`
  );
  return res.status(500).json('Something went wrong.');
};

module.exports = apiErrorHandler;
