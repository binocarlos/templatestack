const BASE = '/api/v1'

const URLS = {
  base: BASE,
  user: {
    status: BASE + '/status',
    login: BASE + '/login',
    register: BASE + '/register',
    logout: BASE + '/logout?redirect=/admin'
  },
  config: BASE + '/config',
  booking: BASE + '/bookings',
  bookingrange: BASE + '/bookingform/range'
}

export default URLS