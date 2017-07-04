const getActionName = (parts) => parts.map(s => s.toUpperCase()).join('_')
const payloadMapper = (payload) => ({payload})

const ensureArgs = (id, actions) => {
  if(!id) throw new Error('id required for ActionFactory')
  if(!actions) throw new Error('actions required for ActionFactory')
}

export const ActionFactory = (id, actions) => {
  ensureArgs(id, actions)
  return (name, inject = {}) => {
    return Object
      .keys(actions)
      .reduce((all, actionName) => {
        const baseActionName = getActionName([ id, actionName ])
        const fullActionName = getActionName([ id, name, actionName ])
        const argMapper = actions[actionName] || payloadMapper
        return Object.assign({}, all, {
          [actionName]: (...args) => {
            return Object.assign({}, argMapper.apply(null, args), inject, {
              type: fullActionName,
              [`name_${id}`]: name,
              [`type_${id}`]: baseActionName
            })
          }
        })
      }, {
        _types: Object
          .keys(actions)
          .reduce((all, actionName) => {
            all[actionName] = getActionName([ id, name, actionName ])
            return all
          }, {})
      })
  }
}

export const TypeFactory = (id, actions) => {
  ensureArgs(id, actions)
  return Object
    .keys(actions)
    .reduce((all, actionName) => {
      return Object.assign({}, all, {
        [actionName]: getActionName([ id, actionName ])
      })
    }, {})
}

export default ActionFactory