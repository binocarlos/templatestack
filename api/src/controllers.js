const Controllers = (settings, databases) => {

  const User = {
    load: (id, done) => {
      done(null, {
        id: id,
        name: 'test'
      })
    }
  }

  return {
    user: User
  }
}

module.exports = Controllers