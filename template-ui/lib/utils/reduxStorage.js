const Storage = (name) => {
  
  const load = () => {
    if(process.env.NODE_ENV == 'production') return window.__INITIAL_STATE__
    const dataString = localStorage.getItem(name)
    const data = dataString ? JSON.parse(dataString) : {}
    if(dataString) {
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log(JSON.stringify(data, null, 4))
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('redux data loaded')
    }
    return data
  }

  const setupSave = (store, functionName = '_save') => {
    if(process.env.NODE_ENV == 'production') return
    const handler = (action) => {
      const state = action == 'delete' ? {} : store.getState()
      const dataString = JSON.stringify(state)
      localStorage.setItem(name, dataString)
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log(JSON.stringify(state, null, 4))
      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('redux data saved')
    }
    window[functionName] = handler
    console.log(`window.${functionName} function setup`)
  }

  return {
    load,
    setupSave
  }
}

export default Storage