import 'isomorphic-fetch'

export const getConfig = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        hello: 10
      })  
    }, 100)
  })
}

const configApi = {
  get: getConfig
}

export default configApi