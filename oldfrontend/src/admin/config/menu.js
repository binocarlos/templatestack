import URLS from '../urls'
import icons from './icons'
import { getRoute } from './core'

export const guest = [
  ['Login', icons.login, getRoute('/login')],
  '-',
  ['Home', icons.home, getRoute('/')],
  ['Help', icons.help, getRoute('/help')],
  ['About', icons.about, getRoute('/about')],
]

export const user = [
  ['Dashboard', icons.dashboard, getRoute('')],
  /*['Companies', icons.installation, getRoute('/companies')],*/
  ['Search', icons.search, getRoute('/bookings')],
  ['Calendar', icons.booking, getRoute('/bookings/calendar')],
  ['Schedule', icons.schedule, getRoute('/bookings/schedule')],
  '-',
  ['Help', icons.help, getRoute('/help')],
  ['About', icons.about, getRoute('/about')],
  '-',
  ['Logout', icons.logout, () => {
    document.location = URLS.user.logout
  }]
]