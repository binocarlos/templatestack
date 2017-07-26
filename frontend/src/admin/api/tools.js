import config from '../config'
export const url = (path) => config.api + path

const tools = {
  url
}

export default tools