import APISelector from 'template-ui/lib/plugins/api/selectors'

export const valuesSelector = (state) => state.value || {}
export const valueSelector = (state, name) => valuesSelector(state)[name]

export const api = APISelector()