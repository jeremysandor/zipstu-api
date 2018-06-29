const express = require('express')
const rp = require('request-promise')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// const config = require( './config' )
const pg = require('./sql')
const middleware = require('./middleware')


class Server {
  constructor( opts = {} ) {
    this.port = opts.port || 45000

    this.app = express()
    this.app.use( cookieParser() )
    this.app.use( bodyParser.json() )
    this.app.use( bodyParser.urlencoded() )

    this.app.use(middleware.logRequest)
    
    this.setupPublicRoutes()
    this.setupPrivateRoutes()  
  }

  async listen() {
    return new Promise( ( resolve, reject ) => {
      this.app.listen( this.port, () => {
        console.log( "zipstu server listening on", this.port )
        resolve()
      })
    })
  }


  setupPublicRoutes() {
    this.app.get('/v1/providers/:provider', this.handleGetProvider.bind(this))
    this.app.get('/v1/providers', this.handleGetAllProviders.bind(this))
  }

  setupPrivateRoutes() {
    const authenticate = middleware.authenticate
    this.app.post('/v1/providers', authenticate, this.handleCreateProvider.bind(this))
  }  

  async handleGetProvider( req, res ) {
    try {
      res.json({foo: 'bar'})
    } catch (err) {
      res.json({ ok: false, message: err.message })
    }
  }

  async handleGetAllProviders( req, res ) {
    console.log('here???')
    try {
      const foo = await pg.testSelect()
      console.log('foo', foo)
      res.json(foo)
    } catch ( err ) {
      res.json({ ok: false, message: err.message })
    }
  }

  async handleCreateProvider( req, res ) {
    try {
      const {customerId, data} = req.body
      console.log('data', data)
      const provider = await pg.createProvider(customerId, data)
      console.log('provider', provider)
      res.json({foo: 'bar'})
    } catch ( err ) {
      res.json({ ok: false, message: err.message })
    }
  }

}

module.exports = Server
