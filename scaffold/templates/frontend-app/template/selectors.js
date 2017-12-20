import system from 'template-ui/lib/plugins2/system/selectors'
import router from 'template-ui/lib/plugins2/router/selectors'
import api from 'template-ui/lib/plugins2/api/selectors'
import form from 'template-ui/lib/plugins2/form/selectors'
import value from 'template-ui/lib/plugins2/value/selectors'
import auth from 'template-ui/lib/plugins2/auth/selectors'

const user = {
  list: {
    data: (state) => value.get(state, 'userList') || [],
    selected: (state) => value.get(state, 'userSelected') || [],
    deleteWindow: (state) => value.get(state, 'userDeleteWindowOpen') ? true : false
  },
  displayName: (user) => {
    if(!user) return ''
    const google = (user.meta || {}).google || {}
    return google.displayName
  },
  token: {
    data: (state) => value.get(state, 'userToken') || ''
  }
}


const selectors = {
  system,
  auth,
  router,  
  api,
  form,
  value,
  user,
}

export default selectors