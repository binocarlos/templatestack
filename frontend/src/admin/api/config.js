import 'isomorphic-fetch'

export const getConfig = (payload) => {
  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.log('config api')
  console.dir(payload)
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