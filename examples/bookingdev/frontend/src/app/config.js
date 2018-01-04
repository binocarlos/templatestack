const icons = {
  dashboard: 'dashboard',
  help: 'help_outline',
  about: 'info_outline',
  home: 'home',
  item: 'label',
  menu: 'menu',
  options: 'more_vert',
  logout: 'exit_to_app',
  login: 'account_circle',
  register: 'create',
  cancel: 'clear',
  revert: 'undo',
  save: 'send',
  add: 'add',
  edit: 'create',
  project: 'layers',
  delete: 'delete',
  folder_open: 'keyboard_arrow_right',
  view: 'visibility',
  actions: 'more_vert',
  folder: 'folder',
  folderadd: 'create_new_folder',
  folderopen: 'folder_open',
  settings: 'settings',
  search: 'search',
  users: 'people',
  video: 'videocam',
  back: 'arrow_back',
  forward: 'arrow_forward',
  time: 'access_time',
  star: 'star',
  disk: 'storage',
  root: 'apps',
  up: 'arrow_upward',
  bookingForm: 'event',
}

const config = {
  title:'',
  basepath:'/app',
  api: '/api/v1',
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
        ['/projects', 'Projects', icons.project],
        ['/resources', 'Resources', icons.folder],
        ['/bookingForms', 'Booking Forms', icons.bookingForm],
        ['-'],
        ['/help', 'Help', icons.help],
        ['authLogout', 'Logout', icons.logout]
      ])
      return ret
    }
  },
  icons
}

export default config