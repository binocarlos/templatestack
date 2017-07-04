const getActionName = (parts) => parts.map(s => s.toUpperCase()).join('_')
const payloadMapper = (payload) => ({payload})
export const ActionFactory = (id, actions) => {
  if(!id) throw new Error('id required for ActionFactory')
  if(!actions) throw new Error('actions required for ActionFactory')
  return (name) => {
    return Object
      .keys(actions)
      .reduce((all, actionName) => {
        const baseActionName = getActionName([ id, actionName ])
        const fullActionName = getActionName([ id, name, actionName ])
        const argMapper = actions[actionName] || payloadMapper
        return Object.assign({}, all, {
          [actionName]: (...args) => {
            return Object.assign({}, argMapper.apply(null, args), {
              type: fullActionName,
              [`type_${id}`]: baseActionName
            })
          }
        })
      }, {})
  }
}