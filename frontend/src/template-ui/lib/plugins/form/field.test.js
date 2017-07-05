import tape from 'tape'

import Field from './field'

tape('Field - get', (t) => {

  const VALUE = 10
  const NAME = 'apples'

  const field = Field({
    name: NAME
  })

  const data = {
    [NAME]: VALUE
  }

  t.equal(field.get(data), VALUE, 'get is correct')
  
  t.end()
})

tape('Field - set', (t) => {

  const VALUE = 10
  const NAME = 'apples'

  const field = Field({
    name: NAME
  })

  let data = {}

  const setData = field.set(data, VALUE)

  t.equal(field.get(data), VALUE, 'set is correct')
  t.equal(setData[NAME], VALUE, 'set data is correct')
  
  t.end()
})

tape('Field - custom get', (t) => {

  const VALUE = 10
  const CUSTOM_VALUE = 5
  const NAME = 'apples'

  const field = Field({
    name: NAME,
    get: () => CUSTOM_VALUE
  })

  let data = {
    [NAME]: VALUE
  }

  t.equal(field.get(data), CUSTOM_VALUE, 'CUSTOM_VALUE is correct')
  
  t.end()
})


tape('Field - custom set', (t) => {

  const CUSTOM_VALUE = 5
  const NAME = 'apples'

  const field = Field({
    name: NAME,
    set: (data, value) => data.custom = value
  })

  const data = field.set({}, CUSTOM_VALUE)

  t.deepEqual(data, {
    custom: CUSTOM_VALUE
  }, 'custom set = CUSTOM_VALUE')

  t.end()
})

tape('Field - custom default', (t) => {

  const CUSTOM_VALUE = 5
  const NAME = 'apples'

  const field = Field({
    name: NAME,
    getDefault: () => CUSTOM_VALUE
  })

  t.equal(field.getDefault(), CUSTOM_VALUE, 'default is CUSTOM_VALUE')
  t.end()
})