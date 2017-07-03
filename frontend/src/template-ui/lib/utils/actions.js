const getActionName = (parts) => parts.map(s => s.toUpperCase()).join('_')

export const ActionFactory = (id, actions) => (name, overrideActions) => {
  const finalActions = Object.assign({}, actions, overrideActions)
  return Object
    .keys(finalActions)
    .reduce((all, actionName) => {
      const baseActionName = getActionName([ id, actionName ])
      const fullActionName = getActionName([ id, name, actionName ])
      const argMapper = finalActions[actionName]

      all[actionName] = (...args) => {
        const actionData = argMapper.apply(null, args)
        return Object.assign({}, actionData, {
          type: baseActionName,
          [`type_${id}`]: fullActionName
        })
      }

    ])

    [${id.toUpperCase(), name.toUpperCase()}_${actionName.toUpperCase()}`
  }, {})

  return Object.assign({}, action, {
    type: `${type}_${name.toUpperCase()}`,
    [`type_${id}`]: type
  })
})