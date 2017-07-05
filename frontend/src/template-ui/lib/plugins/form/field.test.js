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