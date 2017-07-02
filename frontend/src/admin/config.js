const config = {
  title:'Example Admin Panel',
  basepath:'/admin',
  // the default state for the value reducer
  defaultValues: {
    config: {},
    initialized: false,
    user: null,
    menuOpen: false
  },
  icons: {
    dashboard: 'dashboard',
    help: 'help_outline',
    about: 'info_outline',
    home: 'home',
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
}

export default config