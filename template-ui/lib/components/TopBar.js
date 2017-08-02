import React, { Component } from 'react'
import theme from './theme/topbar.css'

export class TopBar extends Component {

  handleScroll() {
    if(this.props.updateScroll) {
      this.props.updateScroll(this.node.scrollTop)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.node && typeof(nextProps.scrollPosition) == 'number') {
      this.node.scrollTop = nextProps.scrollPosition
    }
  }

  componentDidMount() {
    if(this.node) {
      this.node.addEventListener('scroll', this.handleScroll.bind(this))
      this.node.scrollTop = 0
    }
  }

  componentWillUnmount() {
    if(this.node) {
      this.node.removeEventListener('scroll', this.handleScroll.bind(this))
    }
  }

  paneDidMount(node) {
    this.node = node
  }

  render () {
    const height = this.props.height || '264px'
    const minHeight = height
    const maxHeight = height

    return (
      <section className={ theme.container }>
        <header className={ theme.header }>{ this.props.content }</header>
        <article ref={this.paneDidMount.bind(this)} className={ theme.content }>
          { this.props.children }
        </article>
      </section>
    )
  }
}

export default TopBar