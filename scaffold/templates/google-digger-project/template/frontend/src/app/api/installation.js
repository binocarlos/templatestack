import Crud from 'template-ui/lib/plugins2/crud/api'
import tools from './tools'

const BASE_URL = tools.url('/installation')

const api = Crud({
  url: BASE_URL
})

export default api