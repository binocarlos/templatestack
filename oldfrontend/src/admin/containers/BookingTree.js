import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-toolbox/lib/list'
import TreePlugin from 'boiler-ui/lib/containers/TreePlugin'
import TreeDivider from 'boiler-ui/lib/components/TreeDivider'

import TreeLayout from '../components/layout/Tree'

import actions from '../actions'
import icons from '../config/icons'

const BOOKING_MENU = [{
  title: 'Search',
  icon: icons.search,
  url: '/bookings'
},{
  title: 'Calendar',
  icon: icons.booking,
  url: '/bookings/calendar'
},{
  title: 'Schedule',
  icon: icons.schedule,
  url: '/bookings/schedule'
},{
  title: 'Web Form',
  icon: icons.web,
  external: true,
  url: '/booking/dates'
}]


const STYLES = {
  section: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  },
  content: {
    flex: '2',
    overflow: 'auto'
  }
}


class BookingTree extends Component {

  getTree() {
    return (
      <div>
        <List>
          {
            BOOKING_MENU.map((item, i) => {
              return (
                <ListItem
                  key={ i }
                  selectable={true}
                  ripple={true}
                  caption={item.title}
                  leftIcon={item.icon}
                  onClick={() => this.props.viewPage(item.url, item.external)}                  
                />
              )
            })
          }
        </List>
      </div>
    )
  }

  render() {
    const tree = this.getTree()

    return (

      <TreeLayout
        tree={ tree }
      >
        { this.props.children }
      </TreeLayout>
    )
  }
}

export default connect(
  (state) => {
    return {
    }
  },
  (dispatch) => {
    return {  
      viewPage: (url, external) => {
        if(external) {
          window.open(url)
        }
        else {
          dispatch(actions.push(url))  
        }
      }    
    }
  }
)(BookingTree)