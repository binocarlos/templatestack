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
  settings: 'settings',
  search: 'search'
}

const config = {
  title:'Track Tube',
  basepath:'/ui',
  api: '/api/v1',
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
    guest: [
      ['/login', 'Login', icons.login],
      ['-'],
      ['/help', 'Help', icons.help],
      ['/about', 'About', icons.about]
    ],
    user: [
      ['/dashboard', 'Dashboard', icons.dashboard],
      ['-'],
      ['/help', 'Help', icons.help],
      ['authLogout', 'Logout', icons.logout]
    ]
  },
  icons
}

export default config