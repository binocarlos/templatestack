import React, { Component, PropTypes } from 'react'

import Input from 'react-toolbox/lib/input'
import Modal from './Modal'
import SearchResultsList from './SearchResultsList'

class SearchResultsModal extends Component {

  render() {
    const title = this.props.title || 'Search'
    const actions = [
      { label: this.props.cancelTitle || "Cancel", onClick: this.props.onCancel },
    ]    
    return (
      <Modal
        actions={ actions }
        title={`${title}`}
        active={this.props.active}
        onCancel={this.props.onCancel}
      >
        <div>
          <Input type='text' label='Search' name='search' value={this.props.value || ''} onChange={this.props.onSearch}  />
        </div>
        <div>
          <SearchResultsList
            data={this.props.data || []}
            icon={this.props.icon}
            getItemTitle={this.props.getItemTitle}
            onClick={this.props.onConfirm}
          />
        </div>
      </Modal>
    )
  }
}

export default SearchResultsModal