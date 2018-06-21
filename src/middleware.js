const CognitoExpress = require("cognito-express");
const cognitoExpress = new CognitoExpress({
  region: "us-west-2",
  cognitoUserPoolId: "us-west-2_zJjzLQOwE",
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});


exports.authenticate = async (req, res, next) => {
  console.log('authenticate req', req.headers);
  const accessTokenFromClient = req.headers['access-token'];
  cognitoExpress.validate(accessTokenFromClient, function(err, response) { 
    console.log('err', err)
    console.log('response', response)
  });
  next();
}

exports.logRequest = (req, res, next) => {
  console.log(`${(new Date()).toString()}: ${req.method} ${req.originalUrl} from ${req.ip}`)
  return next()
}
