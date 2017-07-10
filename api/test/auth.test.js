"use strict";
const tape = require('tape')
const async = require('async')
const tools = require('./tools')

const headers = tools.headers

/*
tape('auth - not logged in status', (t) => {
  tools.status((err, result) => {
    if(err) t.error(err)
    t.equal(result.statusCode, 200, '200 status')
    t.equal(result.body.loggedIn, false, 'not logged in')
    t.end()
  })
})

tape('auth - register, no username', (t) => {
  tools.register({
    username: '',
    password: 'apples'
  }, (err, result) => {
    if(err) t.error(err)
    t.equal(result.statusCode, 400, '400 status')
    t.equal(result.body.error, 'no username given', 'error correct')
    t.end()
  })
})


tape('auth - register, no password', (t) => {
  tools.register({
    username: 't@t.com',
    password: ''
  }, (err, result) => {
    if(err) t.error(err)
    t.equal(result.statusCode, 400, '400 status')
    t.equal(result.body.error, 'no password given', 'error correct')
    t.end()
  })
})

*/

tape('auth - cycle', (t) => {

  const userData = tools.UserData()

  const badLogin = Object.assign({}, userData, {
    username: userData.username + 'BAD'
  })
  const updateData = {
    meta: Object.assign({}, userData.meta, {
      extraMeta: 10
    })
  }

  const checkUser = (name, body, meta) => {
    meta = meta || userData.meta
    t.notOk(body.hashed_password, `${name} hashed_password not present`)
    t.notOk(body.salt, `${name} salt not present`)
    t.equal(body.username, userData.username, `${name} username is equal`)
    t.deepEqual(body.meta, meta, `${name} meta is equal`)
  }

  const statusCheck = (name, loggedIn) => (body) => {
    t.equal(body.loggedIn, loggedIn, `${name} loggedIn`)

    if(loggedIn) {
      checkUser(name, body.data)
    }
    else {
      t.notOk(body.data, `${name} user data not present`)
    }
  }

  const EXPECTED = {
    guestStatus: [200, statusCheck('guestStatus', false)],
    register: [201, (body) => checkUser('register', body)],
    registerStatus: [200, statusCheck('registerStatus', true)],
    logout: [200, statusCheck('logout', false)],
    logoutStatus: [200, statusCheck('logoutStatus', false)],
    badLogin: [400, (body) => {
      t.equal(body.error, 'incorrect details', 'badLogin error')
    }],
    badUpdate: [403, (body) => {
      t.equal(body.error, 'access denied', 'badUpdate error')
    }],
    login: [200, (body) => checkUser('login', body)],
    loginStatus: [200, statusCheck('loginStatus', true)],
    update: [200, (body) => checkUser('update', body, updateData.meta)]
  }

  async.series({

    guestStatus: (next) => tools.status(next),
    register: (next) => tools.register(userData, next),
    registerStatus: (next) => tools.status(next),
    logout: (next) => tools.logout(next),
    logoutStatus: (next) => tools.status(next),
    badLogin: (next) => tools.login(badLogin, next),
    badUpdate: (next) => tools.update(updateData, next),
    login: (next) => tools.login(userData, next),
    loginStatus: (next) => tools.status(next),
    update: (next) => tools.update(updateData, next)

  }, (err, results) => {

    if(err) t.error(err)

    Object.keys(EXPECTED || {}).forEach(key => {
      const info = EXPECTED[key]
      const result = results[key]

      const code = result.statusCode
      const body = result.body

      const expectedCode = info[0]
      const checkFn = info[1]

      t.equal(code, expectedCode, `${key} statusCode`)
      checkFn(body)
    })

    t.end()
  })
})

/*

tape('auth - register', (t) => {
  const userData = tools.UserData()

  async.series({

    register: (next) => tools.register(userData, next),
    status: (next) => tools.status(next)

  }, (err, results) => {

    if(err) t.error(err)

    console.log('-------------------------------------------');
  console.dir(results)

/*
    

    const register = results.register
    const status = results.status

    const EXPECTED_STATUS = {
      register: 201
    }

    const EXPECTED_BODY = {
      register: { registered: true },
      status: { loggedIn: true }
    }

    Object.keys(results).forEach((key) => {
      const result = results[key]
      const expectedStatus = EXPECTED_STATUS[key] || 200
      t.equal(result.statusCode, expectedStatus, key + ' = ' + expectedStatus + ' status')
    })

    Object.keys(EXPECTED_BODY).forEach((key) => {
      const result = results[key]
      const expected = EXPECTED_BODY[key]

      Object.keys(expected).forEach((field) => {
        t.equal(result.body[field], expected[field], key + ' - body - ' + field + ' = ' + expected[field])
      })
    })

    t.equal(register.body.data.email, userData.email, 'register email is correct')
    t.equal(status.body.data.email, userData.email, 'status email is correct')

    t.equal(register.body.data.hashed_password, undefined, 'no password deets')
    t.equal(status.body.data.hashed_password, undefined, 'no password deets')

    t.end()
  })
})


tape('auth - status', (t) => {
  const userData = tools.UserData()

  async.series({

    register: (next) => tools.register(userData, next),
    status: (next) => tools.status(next),
    logout: (next) => tools.logout(next),
    nostatus: (next) => tools.status(next),
    login: (next) => tools.login(userData, next),
    loginstatus: (next) => tools.status(next)

  }, (err, results) => {

    if(err) t.error(err)


    const register = results.register
    const status = results.status

    const EXPECTED_STATUS = {
      register: 201
    }

    const EXPECTED_BODY = {
      register: { registered: true },
      status: { loggedIn: true },
      nostatus: { loggedIn: false },
      login: { loggedIn: true },
      loginstatus: { loggedIn: true },
    }

    Object.keys(results).forEach((key) => {
      const result = results[key]
      const expectedStatus = EXPECTED_STATUS[key] || 200
      t.equal(result.statusCode, expectedStatus, key + ' = ' + expectedStatus + ' status')
    })

    Object.keys(EXPECTED_BODY).forEach((key) => {
      const result = results[key]
      const expected = EXPECTED_BODY[key]

      Object.keys(expected).forEach((field) => {
        t.equal(result.body[field], expected[field], key + ' - body - ' + field + ' = ' + expected[field])
      })
    })

    t.end()
  })
})


tape('auth - account exists', (t) => {
  const userData = tools.UserData()

  async.series({

    register: (next) => tools.register(userData, next),
    exists: (next) => tools.register(userData, next)

  }, (err, results) => {

    if(err) t.error(err)

    t.equal(results.exists.statusCode, 500, '500 status')
    t.equal(results.exists.body.error, userData.email + ' already exists', 'error message')

    t.end()
  })
})

tape('auth - login with bad details', (t) => {
  const userData = tools.UserData()

  tools.login({
    email: 'nad12@sddff.com',
    password: '34394393949'
  }, (err, results) => {
    t.equal(results.statusCode, 500, '500 code')
    t.end()
  })
})

*/