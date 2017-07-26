const APISelectors = (id = 'api') => {
  const data = (state, name) => {
    const base = state[id]
    return base[name] || { status: 'fresh' }
  }

  const loading = (state, name) => {
    const base = data(state, name)
    return !base.status || base.status == 'loading'
  }

  const error = (state, name) => data(state, name).error

  return {
    data,
    loading,
    error
  }
}

export default APISelectors