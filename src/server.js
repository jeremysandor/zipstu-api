const express = require( 'express' );
const rp = require( 'request-promise' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );
// const config = require( './config' );

class Server {
  constructor( opts = {} ) {
    this.port = opts.port || 45000;

    this.app = express();
    this.app.use( cookieParser() );
    this.app.use( bodyParser.json() );
    this.app.use( bodyParser.urlencoded() );

    this.setupRoutes();
  }

  async listen() {
    return new Promise( ( resolve, reject ) => {
      this.app.listen( this.port, () => {
        console.log( "zipstu server listening on", this.port );
        resolve();
      })
    })
  }

  setupRoutes() {
    this.app.get('/v1/provider', this.handleGetProviders.bind(this));
    this.app.post('/v1/provider', this.handleCreateProvider.bind(this));
  }

  async handleGetProviders( req, res ) {
    try {
      res.json({foo: 'bar'});
    } catch ( err ) {
      res.json( { ok: false, message: err.message } );
    }
  }

  async handleCreateProvider( req, res ) {
    try {
      res.json({foo: 'bar'});
    } catch ( err ) {
      res.json( { ok: false, message: err.message } );
    }
  }

}

module.exports = Server;
