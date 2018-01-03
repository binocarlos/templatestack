const sortItems = (data) => {
  const folders = data.filter(item => item.type == 'folder')
  const rest = data.filter(item => item.type != 'folder')

  return folders.concat(rest)
}

const tools = {
  sortItems
}

export default tools