import AuthApi from 'template-ui/lib/plugins2/auth/api'
import tools from './tools'

const BASE_URL = tools.url('/auth')

const userApi = AuthApi({
  url: BASE_URL
})

export default userApi