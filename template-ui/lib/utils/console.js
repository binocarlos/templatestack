export const isDevelopment = () => process.env.NODE_ENV == 'development'

export const devLogger = (st, methodName = 'log') => {
  if(!isDevelopment()) return
  console[methodName](st)
}

export const devRun = (fn) => isDevelopment() ? fn() : null

const tools = {
  isDevelopment,
  devLogger,
  devRun
}

export default tools