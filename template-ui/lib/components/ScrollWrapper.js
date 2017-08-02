import React, { Component, PropTypes } from 'react'

class ScrollWrapper extends Component {

  state = {
    offset: 0
  }

  handleScroll(e) {
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('scroll')
    var doc = document.documentElement
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    console.log('-------------------------------------------');
    console.dir(top)
    this.setState({
      offset: top
    })
  }

  componentDidMount() {
    console.log('-------------------------------------------');
    console.log('mounting')
    window.addEventListener("scroll", this.handleScroll.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this))
  }

  render() {
    return (
      <div>
        <div style={{ marginTop: (this.state.offset + 'px') }}>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default ScrollWrapper