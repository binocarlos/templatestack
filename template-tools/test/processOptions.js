const tape = require('tape')
const processOptions = require('../src/processOptions')

tape('required options', (t) => {
  const required = [
    'width',
    'height'
  ]
  const errorFields = processOptions.getErrorFields({
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
  const errorFields = processOptions.getErrorFields({
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
  const data = processOptions.getDefaultData({
    
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
    processOptions.throwErrorFields({
      width: 'hello'
    }, {
      required
    })
  }, /width should be of type number, height is required/, "Should throw typeError")
  
  t.end()
})

tape('processOptions throws', (t) => {
  const required = [
    'width:number',
    'height'
  ]

  t.throws(() => {
    const opts = processOptions.processOptions({
      width: 'hello'
    }, {
      required
    })
  }, /width should be of type number, height is required/, "Should throw typeError")
  
  t.end()
})

tape('processOptions defaults', (t) => {
  const required = [
    'width:number',
    'height:number'
  ]
  const defaults = {
    height: 5
  }
  const data = processOptions.processOptions({
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
