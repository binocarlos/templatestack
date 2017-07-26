import processLoaders from 'template-ui/lib/plugins/api/processLoaders'
import auth from './auth'

export const backends = {
  auth
}

// a combo of handler, actions and saga
const loaders = {
  
}

const processedLoaders = processLoaders(loaders)
const apis = processedLoaders.apis

export const actions = processedLoaders.actions
export default apis