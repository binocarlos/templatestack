import system from 'template-ui/lib/plugins2/system/selectors'
import router from 'template-ui/lib/plugins2/router/selectors'
import api from 'template-ui/lib/plugins2/api/selectors'
import form from 'template-ui/lib/plugins2/form/selectors'
import value from 'template-ui/lib/plugins2/value/selectors'
import auth from 'template-ui/lib/plugins2/auth/selectors'
import Crud from 'template-ui/lib/plugins2/crud/selectors'
import Digger from 'template-ui/lib/plugins2/digger/selectors'

const user = Crud({
  name: 'user'
})

const installation = Crud({
  name: 'installation'
})

const resource = Digger({
  name: 'resource'
})

const selectors = {
  system,
  auth,
  router,  
  api,
  form,
  value,
  user,
  installation,
  resource,
}

export default selectors