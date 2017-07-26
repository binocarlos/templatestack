import processLoaders from 'template-ui/lib/plugins/api/processLoaders'
import handlers from './api_handlers'

const loaders = {
  
}

const processedLoaders = processLoaders(loaders)
const apis = processedLoaders.apis

export const actions = processedLoaders.actions
export default apis