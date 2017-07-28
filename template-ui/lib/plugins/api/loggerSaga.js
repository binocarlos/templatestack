import consoleTools from '../../utils/console'

const Logger = (type) => {
  function* logger(req) {
    consoleTools.devRun(() => {
      console.log(`api ${type}: ${req.name}`)
      console.dir(req)
    })
  }
  return logger
}

export default Logger