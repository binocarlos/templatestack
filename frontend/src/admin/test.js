import React, { Component, PropTypes } from 'react'
import TestUI from 'template-ui/lib/test'

console.log('-------------------------------------------');
console.log('-------------------------------------------');
console.dir(TestUI)

class Test extends Component {

  render() {
    return (
      <div><TestUI /></div>
    )
  }

}

export default Test