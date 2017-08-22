'use strict'

const backend = (hemera, opts = {}) => {

  const addOpts = Object.assign({}, opts.inbound, opts.query)

  hemera.add(addOpts, (req, done) => {
    const actOpts = Object.keys(opts.query).reduce((all, name) => {
      all[name] = req[name]
      return all
    }, opts.outbound)
    hemera.act(actOpts, (err, result) => {
      if(err) return done(err)
      done(null, opts.map ? opts.map(result) : result)
    })
  })
}

module.exports = {
  backend
}