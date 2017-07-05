import RouterSaga from 'template-ui/lib/plugins/router/saga'

import config from '../config'
import redirects from './redirects'
import loaders from './loaders'

const routerSaga = RouterSaga({
  redirects,
  loaders,
  basepath: config.basepath
})

export default routerSaga