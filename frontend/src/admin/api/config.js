export const load = (payload) => {  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        hello: 10
      })  
    }, 100)
  })
}

const configApi = {
  load
}

export default configApi