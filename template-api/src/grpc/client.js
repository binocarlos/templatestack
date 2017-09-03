'use strict'

// make sure reqs are sent as call.request (i.e. fake grpc for the moment)
const Client = (channel, backend) => {
  if(!backend) throw new Error('no backend given for client')
  return Object.keys(backend).reduce((all, name) => {
    const backendHandler = backend[name]
    all[name] = (req, done) => {
      backendHandler({
        request: req
      }, (err, answer) => {
        if(err) {
          console.error(`RPC error ${channel} : ${name} : ${ err.toString() }`)
          console.log(JSON.stringify(req))
          return done(err)
        }
        else {
          console.log(`rpc response ${channel} : ${name}`)
          console.log(JSON.stringify(req))
          return done(null, answer)
        }
      })
    }
    return all
  }, {})
}

module.exports = Client