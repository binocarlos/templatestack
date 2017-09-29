const project = {
  name: {}
}

const layer1 = {
  name: {
    title: 'Name',
    value: (row, props) => row.name + ' LAYER1'
  }
}

const layer2 = {
  name: {
    title: 'Name',
    value: (row, props) => row.name + ' LAYER2'
  }
}

const tables = {
  project,
  layer1,
  layer2
}

export default tables