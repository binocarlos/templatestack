import processLoaders from 'template-ui/lib/plugins/api/processLoaders'
import auth from './auth'
import installation from './installation'

export const backends = {
  auth,
  installation
}

// a combo of handler, actions and saga
const loaders = {

  // installation
  installationList: installation.list,
  installationGet: installation.get,
  installationCreate: installation.create,
  installationSave: installation.save,
  installationDel: installation.del,
  installationActivate: installation.activate,
}

const processedLoaders = processLoaders(loaders)
const apis = processedLoaders.apis

export const actions = processedLoaders.actions
export default apis