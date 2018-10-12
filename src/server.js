const express = require('express')
const rp = require('request-promise')
const bodyParser = require('body-parser')

const pg = require('./sql')
const middleware = require('./middleware')


class Server {
  constructor( opts = {} ) {
    this.port = opts.port || 45000

    this.app = express()
    this.app.use( bodyParser.json() )
    this.app.use( bodyParser.urlencoded() )

    this.app.use(middleware.logRequest)
    this.app.use(middleware.setupCors)
    
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
    this.app.get('/v1/providers', this.handleGetAllProviders.bind(this))
  }

  setupPrivateRoutes() {
    const authenticate = middleware.authenticate
    this.app.get('/v1/providers/:provider', authenticate, this.handleGetProvider.bind(this))
    this.app.post('/v1/providers', authenticate, this.handleCreateProvider.bind(this))
  }  

  async handleGetAllProviders( req, res ) {
    try {
      const providers = await pg.getProviders()
      res.json(providers)
    } catch ( err ) {
      res.json({ ok: false, message: err.message })
    }
  }  

  async handleGetProvider( req, res ) {
    try {
      const customerId = req.customerId
      const provider = await pg.getProvider(customerId)
      res.json(provider)
    } catch (err) {
      res.json({ ok: false, message: err.message })
    }
  }

  async handleCreateProvider( req, res ) {
    try {
      const { data }   = req.body
      const customerId = req.customerId
      const provider = await pg.upsertProvider(customerId, data)
      res.json(provider)
    } catch ( err ) {
      res.json({ ok: false, message: err.message })
    }
  }

}

module.exports = Server
