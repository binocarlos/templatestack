import axios from 'axios'

export const request = (req = {}) => {

  let reqOpts = {
    method: req.method || 'get',
    url: req.url,
    responseType: req.responseType || 'json',
    params: req.params || {}
  }

  if(req.data){
    reqOpts.transformRequest = [(data) => JSON.stringify(data)]
    reqOpts.data = req.data
    reqOpts.headers = {
      'Content-Type': 'application/json'
    }
  }

  return axios(reqOpts)
    .then(
      res => res.data,
      err => {
        throw err
      }
    )
}

export default request