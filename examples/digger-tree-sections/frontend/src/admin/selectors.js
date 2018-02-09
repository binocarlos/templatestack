import system from 'template-ui/lib/plugins2/system/selectors'
import router from 'template-ui/lib/plugins2/router/selectors'
import api from 'template-ui/lib/plugins2/api/selectors'
import form from 'template-ui/lib/plugins2/form/selectors'
import value from 'template-ui/lib/plugins2/value/selectors'
import auth from 'template-ui/lib/plugins2/auth/selectors'
import sharedSelectors from '../shared/selectors'

import utils from './utils'

const bookingForm = sharedSelectors.bookingForm

const bookingForms = {
  list: state => value.get(state, 'bookingForms') || [],
  section: state => router.firstValue(state, 'bookingFormsSection'),
  currentId: state => router.param(state, 'bookingFormId'),
  current: state => {
    const id = bookingForms.currentId(state)
    if(!id) return {}
    const list = bookingForms.list(state)
    return list.filter(utils.matchBooking(id))[0] || {}    
  }
}

const selectors = {
  system,
  auth,
  router,  
  api,
  form,
  value,
  bookingForms,
  bookingForm,
}

export default selectors