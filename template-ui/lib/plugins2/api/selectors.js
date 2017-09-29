const api = {
  data: (state, name) => state.value[`api_${name}`] || {},
  status: (state, name) => api.data(state, name).status,
  error: (state, name) => api.data(state, name).error,
  loading: (state, name) => api.status(state, name) == 'loading',
  loaded: (state, name) => api.status(state, name) == 'loaded'
}

export default api