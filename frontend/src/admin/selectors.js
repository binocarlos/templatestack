import system from 'template-ui/lib/plugins2/system/selectors'
import router from 'template-ui/lib/plugins2/router/selectors'
import api from 'template-ui/lib/plugins2/api/selectors'
import form from 'template-ui/lib/plugins2/form/selectors'
import value from 'template-ui/lib/plugins2/value/selectors'
import auth from 'template-ui/lib/plugins2/auth/selectors'

const project = {
  list: {
    data: (state) => value.get(state, 'projectList') || [],
    selected: (state) => value.get(state, 'projectSelected') || [],
    deleteWindow: (state) => value.get(state, 'projectDeleteWindowOpen') ? true : false
  }
}

const selectors = {
  system,
  auth,
  router,
  project,
  api,
  form,
  value
}

export default selectors