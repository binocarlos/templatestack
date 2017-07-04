const getActionName = (parts) => parts.map(s => s.toUpperCase()).join('_')
const payloadMapper = (payload) => ({payload})

const ensureArgs = (id, actions) => {
  if(!id) throw new Error('id required for ActionFactory')
  if(!actions) throw new Error('actions required for ActionFactory')
}

export const BaseAction = (id, name, actionName) => {
  return {
    type: getActionName([ id, actionName, name ]),
    _genericid: id,
    _genericname: name,
    _genericaction: actionName
  }
}

export const ActionFactory = (id, actions) => {
  ensureArgs(id, actions)
  return (name, inject = {}) => {
    return Object.keys(actions)
      .reduce((all, actionName) => {
        all[actionName] = (...args) => {
          const handler = actions[actionName] || payloadMapper
          const actionProps = handler.apply(null, args)
          const baseActionProps = BaseAction(id, name, actionName)
          return Object.assign({}, actionProps, inject, baseActionProps)
        }
        all._types[actionName] = getActionName([ id, actionName, name ])
        return all
      }, {
        _types: {}
      })
  }
}

export default ActionFactory