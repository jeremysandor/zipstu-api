const CognitoExpress = require("cognito-express")
const cognitoExpress = new CognitoExpress({
  region: "us-west-2",
  cognitoUserPoolId: "us-west-2_zJjzLQOwE",
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
})

exports.logRequest = (req, res, next) => {
  console.log(`${(new Date()).toString()}: ${req.method} ${req.originalUrl} from ${req.ip}`)
  return next()
}

exports.authenticate = async (req, res, next) => {
  // console.log('authenticate req', req.headers);
  const accessTokenFromClient = req.headers['access-token'];
  cognitoExpress.validate(accessTokenFromClient, function(err, response) { 
    console.log('authentication response:', response)
    console.log('authentication err:', err)
    if (err) {
      res.status(401).send({ error: 'Not Authorized, please sign in' })
    } else {
      req.customerId = response.username
      next()      
    }
  })
  
}

exports.setupCors = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();  
}
