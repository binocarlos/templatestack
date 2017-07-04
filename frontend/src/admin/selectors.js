export const valuesSelector = (state) => state.value || {}
export const valueSelector = (state, name) => valuesSelector(state)[name]

export const formsSelector = (state, name) => {
  const formState = state.form || {}
  if(formState[name]) return formState[name]
  return {
    model: {},
    form: {},
    meta: {}
  }
}
