import RouterSaga from 'template-ui/lib/plugins/router/saga'

import config from '../config'
import redirects from './redirects'
import loaders from './loaders'
import triggers from './triggers'

const routerSaga = RouterSaga({
  redirects,
  loaders,
  triggers,
  basepath: config.basepath
})

export default routerSaga