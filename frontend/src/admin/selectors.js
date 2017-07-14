import APISelector from 'template-ui/lib/plugins/api/selectors'

export const valuesSelector = (state) => state.value || {}
export const valueSelector = (state, name) => valuesSelector(state)[name]

export const formStatus = (name) => (state) => {
  const formData = state.form[name]
  if(!formData) return {}
  
}

export const api = APISelector()