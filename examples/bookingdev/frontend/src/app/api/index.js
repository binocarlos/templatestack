import auth from './auth'
import user from './user'
import installation from './installation'
import digger from '../digger'

const apis = {
  auth,
  user,
  installation,
  resource: digger.resource.api,
}

export default apis