import authSelectors from 'template-ui/lib/plugins2/auth/selectors'
import config from '../config'
export const url = (path = '') => config.api + path

const BASE_URL = url()

const installationWrapper = (SUB_URL) => (state) => {
  const installationid = authSelectors.activeInstallationId(state)
  return `${BASE_URL}/installation/${installationid}${SUB_URL}`
}

const tools = {
  url,
  installationWrapper,
}

export default tools