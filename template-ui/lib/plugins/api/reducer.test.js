import tape from 'tape'

import ApiActions from './actions'
import ApiReducer from './reducer'
const payloads = {
  request: 10,
  response: 20,
  error: 30
}
const runTests = (expectPayloads) => {
  const getTitle = (title) => title + ' - ' + (expectPayloads ? ' with payloads' : ' without payloads')
  
  tape(getTitle('ApiReducer'), (t) => {
    const actions = ApiActions()('fruit', { keepPayload: expectPayloads })
    const reducer = ApiReducer()
    const defaultState = reducer()

    t.deepEqual(defaultState, {}, getTitle('default state'))

    const requestState = reducer(defaultState, actions.request(payloads.request))

    t.deepEqual(requestState, { 
      fruit: { 
        status: 'loading',
        error: null,
        request_payload: expectPayloads ? payloads.request : null,
        response_payload: null 
      }
    }, getTitle('request status'))

    const responseState = reducer(requestState, actions.response(payloads.response))

    t.deepEqual(responseState, { 
      fruit: { 
        status: 'loaded',
        error: null,
        request_payload: expectPayloads ? payloads.request : null,
        response_payload: expectPayloads ? payloads.response : null 
      }
    }, getTitle('response status'))

    const errorState = reducer(requestState, actions.error(payloads.error))

    t.deepEqual(errorState, { 
      fruit: { 
        status: 'error',
        error: payloads.error,
        request_payload: expectPayloads ? payloads.request : null,
        response_payload: null 
      }
    }, getTitle('error status'))
    
    t.end()
  })
}

runTests(false)
runTests(true)
