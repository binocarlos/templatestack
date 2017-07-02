import 'isomorphic-fetch'

export const status = (payload) => {  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        loggedIn: false
      })  
    }, 100)
  })
}

const userApi = {
  status
}

export default userApi