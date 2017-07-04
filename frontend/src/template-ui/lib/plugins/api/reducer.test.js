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
    const actions = ApiActions('fruit', { keepPayload: expectPayloads })
    const defaultState = ApiReducer()

    t.deepEqual(defaultState, {}, getTitle('default state'))

    const requestState = ApiReducer(defaultState, actions.request(payloads.request))

    t.deepEqual(requestState, { 
      fruit: { 
        status: 'loading',
        error: null,
        request_payload: expectPayloads ? payloads.request : null,
        response_payload: null 
      }
    }, getTitle('request status'))

    const responseState = ApiReducer(requestState, actions.response(payloads.response))

    t.deepEqual(responseState, { 
      fruit: { 
        status: 'loaded',
        error: null,
        request_payload: expectPayloads ? payloads.request : null,
        response_payload: expectPayloads ? payloads.response : null 
      }
    }, getTitle('response status'))

    const errorState = ApiReducer(requestState, actions.error(payloads.error))

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
