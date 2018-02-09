import baseConfig from '../shared/config'

const config = Object.assign({}, baseConfig, {
  title:'Booking',
  basepath:'/booking',
  googleLogin: '/api/v1/auth/google',
  logout: '/api/v1/auth/logout',
  // the default state for the value reducer
  initialState: {
    value: {
      initialized: false,
      user: null,
      menuOpen: false
    }
  },  
  menu: {
    guest: () => ([
      ['/login', 'Login', icons.login],
      ['/register', 'Register', icons.register],
      ['-'],
      ['/help', 'Help', icons.help],
      ['/about', 'About', icons.about]
    ]),
    user: (user) => {
      let ret = [
        ['/dashboard', 'Dashboard', icons.dashboard],
      ]

      if(user.tags.admin) {
        ret = ret.concat([
          ['/users', 'Users', icons.users]
        ])
      }

      ret = ret.concat([
        ['-'],
        ['/search', 'Search', icons.search],
        ['/calendar', 'Calendar', icons.calendar],
        ['/schedule', 'Schedule', icons.schedule],
        ['-'],
        ['/bookingForms', 'Booking Forms', icons.bookingForm],
        ['/config', 'Config', icons.settings],
        ['/companies', 'Companies', icons.project],
        ['-'],
        ['/help', 'Help', icons.help],
        ['authLogout', 'Logout', icons.logout]
      ])
      return ret
    }
  }
})

export default config