'use strict'

const Clients = () => (name) => {

}
channel, backend) => {
  return Object.keys(backend).reduce((all, name) => {
    const backendHandler = backend[name]
    all[name] = (req, done) => {
      console.log(`running rpc ${channel} : ${name}`)
      console.log(JSON.stringify(req, null, 4))
      backendHandler({
        request: req
      }, (err, answer) => {
        if(err) {
          console.error(`RPC error ${channel} : ${name} : ${ err.toString }`)
          return done(err)
        }
        else {
          console.log(`rpc response ${channel} : ${name}`)
          console.dir(answer)
          return done(null, answer)
        }
      })
    }
    return all
  }, {})
}

module.exports = Client