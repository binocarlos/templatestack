const getActionName = (parts) => parts.map(s => s.toUpperCase()).join('_')
const payloadMapper = (payload) => ({payload})

const ensureArgs = (id, actions) => {
  if(!id) throw new Error('id required for ActionFactory')
  if(!actions) throw new Error('actions required for ActionFactory')
}

export const BaseAction = (id, name, actionName) => {
  return {
    type: getActionName([ id, name, actionName ]),
    _genericid: id,
    _genericname: name,
    _genericaction: actionName
  }
}

export const ActionFactory = (id, actions) => {
  ensureArgs(id, actions)
  return (name, inject = {}) => {
    return Object
      .keys(actions)
      .reduce((all, actionName) => {
        all[actionName] = (...args) => {
          const handler = actions[actionName] || payloadMapper
          const actionProps = handler.apply(null, args)
          const baseActionProps = BaseAction(id, name, actionName)
          return Object.assign({}, actionProps, inject, baseActionProps)
        }
        return all
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