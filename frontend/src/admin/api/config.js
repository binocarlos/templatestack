import 'isomorphic-fetch'

const loadConfig = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        hello: 10
      })  
    }, 100)
  })
}

export default loadConfig