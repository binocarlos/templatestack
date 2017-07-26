const getActionName = (parts) => parts.filter(s => s).map(s => s.toUpperCase()).join('_')
const payloadMapper = (payload) => ({payload})

const ensureArgs = (id, actions) => {
  if(!id) throw new Error('id required for ActionFactory')
  if(!actions) throw new Error('actions required for ActionFactory')
}

export const BaseAction = (id, name, actionName) => {
  return {
    type: getActionName([ id, actionName, name ]),
    _generictype: getActionName([ id, actionName ]),
    _genericid: id,
    _genericname: name,
    _genericaction: actionName
  }
}

export const ActionFactory = (id, actions) => {
  ensureArgs(id, actions)
  const actionFactory = (name, inject = {}) => {
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

  actionFactory._id = id
  actionFactory._genericTypes = Object.keys(actions)
    .reduce((all, actionName) => {
      all[actionName] = getActionName([ id, actionName ])
      return all
    }, {})
    
  return actionFactory
}

export const actionInfo = (action) => ({
  type: action._generictype,
  id: action._genericid,
  name: action._genericname,
  action: action._genericaction
})

export default ActionFactory