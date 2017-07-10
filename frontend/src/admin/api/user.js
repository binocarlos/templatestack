export const status = (payload) => {  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        loggedIn: false
      })
    }, 100)
  })
}

export const login = (payload) => {  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        loggedIn: true
      })
    }, 100)
  })
}

export const register = (payload) => {  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        registered: true
      })
    }, 100)
  })
}

const userApi = {
  status,
  login,
  register
}

export default userApi