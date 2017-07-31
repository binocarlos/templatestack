import React, { Component } from 'react'
import theme from './theme/topbar.css'

export class TopBar extends Component {

  render () {
    const height = this.props.height || '264px'
    const minHeight = height
    const maxHeight = height

    return (
      <section className={ theme.container }>
        <header className={ theme.header }>{ this.props.content }</header>
        <article className={ theme.content }>
            { this.props.children }
        </article>
      </section>
    )
  }
}

export default TopBar