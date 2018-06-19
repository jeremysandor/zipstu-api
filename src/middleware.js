exports.authenticate = async (req, res, next) => {
  console.log('authenticate req', req);
  console.log('authenticate res', res);
}

exports.logRequest = (req, res, next) => {
  console.log(`${(new Date()).toString()}: ${req.method} ${req.originalUrl} from ${req.ip}`)
  return next()
}
