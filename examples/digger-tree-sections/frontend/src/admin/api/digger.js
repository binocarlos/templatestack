import Digger from 'template-ui/lib/plugins2/digger/api'
import tools from './tools'

const SUB_URL = '/resources'

const api = Digger({
  getBaseUrl: tools.installationWrapper(SUB_URL),
})

export default api