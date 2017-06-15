import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-toolbox/lib/date_picker'
import Checkbox from 'react-toolbox/lib/checkbox'
import TablePlugin from 'boiler-ui/lib/containers/TablePlugin'
import GenericToolbar from 'boiler-ui/lib/components/toolbars/Generic'
import TableToolbar from 'boiler-ui/lib/components/toolbars/Table'
import SearchPlugin from 'boiler-ui/lib/containers/SearchPlugin'

import tables from '../config/tables'
import icons from '../config/icons'
import plugins from '../plugins'
import selectors from '../selectors'
import actions from '../actions'

const STYLES = {
  container: {
    textAlign: 'right',
    paddingRight: '20px'
  },
  searchDiv: {
    display: 'inline-block',
    paddingRight: '20px'
  }
}

class BookingTableContainer extends Component {
  getToolbar(props) {

    const dates = this.props.search.all ? null : (
      <div style={ STYLES.searchDiv }>
        <div style={ STYLES.searchDiv }>
          from:
        </div>
        <div style={ STYLES.searchDiv }>
          <DatePicker 
            autoOk={ true }
            value={ this.props.search.from }
            onChange={ (val) => {
              this.props.updateSearch('from', val)
            } }
          />
        </div>
        <div style={ STYLES.searchDiv }>
          to:
        </div>
        <div style={ STYLES.searchDiv }>
          <DatePicker 
            autoOk={ true }
            value={ this.props.search.to }
            onChange={ (val) => {
              this.props.updateSearch('to', val)
            } }
          />
        </div>
      </div>

    )

    const search = props.selectedItems.length == 0 ? (
      <div style={ STYLES.container }>
        { dates }
        <div style={ STYLES.searchDiv }>
          <SearchPlugin
            selector={props.searchSelector}
            dispatcher={props.searchDispatcher}
          />
        </div>
        <div style={ STYLES.searchDiv }>
          <Checkbox
            checked={ this.props.search.all }
            label='search all'
            onChange={ (val) => {
              this.props.updateSearch('all', val)
            } }
          />
        </div>
      </div>
    ) :
    null


    const toolbarProps = Object.assign({}, props, {
      title: 'Bookings',
      icon: icons.search,
      rightChildren: search
    })
    return (
      <GenericToolbar {...toolbarProps}>
        
      </GenericToolbar>
    )
  }

  render() {
    return (
      <TablePlugin 
        heading={ true }
        selector={[
          plugins.booking.table.selectors.container
        ]}
        selectable={ false }
        searchSelector={this.props.searchSelector}
        searchDispatcher={this.props.searchDispatcher}
        dispatcher={plugins.booking.table.actions.dispatcher}
        table={tables.booking}
        getIcon={() => icons.search}
        getItemTitle={plugins.booking.getItemTitle}
        mainTitle='Bookings'
        getToolbar={(props) => this.getToolbar(props)}
      />
    )
  }
}

export default connect(
  (state) => {
    return {
      search: {
        from: selectors.search.from(state),
        to: selectors.search.to(state),
        all: selectors.search.all(state)
      }
    }
  },
  (dispatch) => {
    return {
      updateSearch: (name, value) => {
        dispatch(actions.updateSearch(name, value))
      }
    }
  }
)(BookingTableContainer)
