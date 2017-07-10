const icons = {
  dashboard: 'dashboard',
  help: 'help_outline',
  about: 'info_outline',
  home: 'home',
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
  delete: 'delete',
  folder_open: 'keyboard_arrow_right',
  view: 'visibility',
  actions: 'more_vert',
  folder: 'folder',
  folderadd: 'create_new_folder',
  settings: 'settings',
  search: 'search'
}

const config = {
  title:'Example Admin Panel',
  basepath:'/admin',
  api: '/api/v1',
  // the default state for the value reducer
  initialState: {
    value: {
      config: {},
      initialized: false,
      user: null,
      menuOpen: false,
      test: 10
    }
  },  
  menu: {
    guest: [
      ['/login', 'Login', icons.login],
      ['/register', 'Register', icons.register],
      ['-'],
      ['/help', 'Help', icons.help],
      ['/about', 'About', icons.about]
    ],
    user: [
      ['/dashboard', 'Dashboard', icons.dashboard],
      ['-'],
      ['/help', 'Help', icons.help],
      ['/about', 'About', icons.about],
      ['-'],
      ['logout', 'Logout', icons.logout]
    ]
  },
  icons
}

export default config