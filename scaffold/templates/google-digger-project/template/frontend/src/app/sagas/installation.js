import selectors from '../selectors'
import actions from '../actions'

import InstallationSaga from 'template-ui/lib/plugins2/installation/saga'

const InstallationSagaFactory = (opts = {}) => {

  const installationSaga = InstallationSaga({
    actions: actions.installation,
    selectors: selectors.installation,
    apis: opts.apis,
  })

  return installationSaga
}

export default InstallationSagaFactory