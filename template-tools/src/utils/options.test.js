const tape = require('tape')
const options = require('./options')

tape('required options', (t) => {
  const required = [
    'width',
    'height'
  ]
  const errorFields = options.getErrorFields({
    width: 5
  }, {
    required
  })

  t.equal(errorFields.length, 1, '1 result')
  t.deepEqual(errorFields[0], {
    field: 'height',
    isBlank: true,
    incorrectType: false,
    requiredType: undefined
  })

  t.end()
})

tape('type options', (t) => {
  const required = [
    'width:number',
    'height:function'
  ]
  const errorFields = options.getErrorFields({
    width: 'hello',
    height: () => {}
  }, {
    required
  })

  t.equal(errorFields.length, 1, '1 result')
  t.deepEqual(errorFields[0], {
    field: 'width',
    isBlank: false,
    incorrectType: true,
    requiredType: 'number'
  })
  

  t.end()
})


tape('defaults', (t) => {
  const required = [
    'width',
    'height'
  ]
  const defaults = {
    width: 20,
    height: 10
  }
  const data = options.getDefaultData({
    
  }, {
    required,
    defaults
  })

  t.deepEqual(data, {
    width: 20,
    height: 10
  })
  
  t.end()
})

tape('throw errors', (t) => {
  const required = [
    'width:number',
    'height'
  ]
  t.throws(() => {
    options.throwErrorFields({
      width: 'hello'
    }, {
      required
    })
  }, /width should be of type number, height is a required option/, "Should throw typeError")
  
  t.end()
})

tape('processor throws', (t) => {
  const required = [
    'width:number',
    'height'
  ]

  t.throws(() => {
    const opts = options.processor({
      width: 'hello'
    }, {
      required
    })
  }, /width should be of type number, height is a required option/, "Should throw typeError")
  
  t.end()
})

tape('processor defaults', (t) => {
  const required = [
    'width:number',
    'height:number'
  ]
  const defaults = {
    height: 5
  }
  const data = options.processor({
    width: 4
  }, {
    required,
    defaults
  })
  t.deepEqual(data, {
    width: 4,
    height: 5
  })
  t.end()
})


tape('processor defaults with null value', (t) => {
  const required = [
    'width:number'
  ]
  const defaults = {
    height: 5
  }
  const data = options.processor({
    width: 4,
    height: undefined
  }, {
    required,
    defaults
  })
  t.deepEqual(data, {
    width: 4,
    height: 5
  })
  t.end()
})
