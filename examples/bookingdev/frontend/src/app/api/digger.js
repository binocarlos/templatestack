import Digger from 'template-ui/lib/plugins2/digger/api'
import tools from './tools'

const BASE_URL = tools.url()
const SUB_URL = '/resources'

const api = Digger({
  url: BASE_URL,
  suburl: SUB_URL,
})

export default api