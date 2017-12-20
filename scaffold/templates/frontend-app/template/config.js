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
  search: 'search',
  users: 'people',
  video: 'videocam',
  back: 'arrow_back',
  forward: 'arrow_forward',
  time: 'access_time'
}

const config = {
  title:'{{title}}',
  basepath:'/app',
  api: '/api/v1',
  login: '/api/v1/auth/google',
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
          ['/admin/users', 'Users', icons.users]
        ])
      }

      ret = ret.concat([
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