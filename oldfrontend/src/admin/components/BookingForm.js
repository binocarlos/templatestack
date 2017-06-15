import React, { Component, PropTypes } from 'react'

import DatePicker from 'react-toolbox/lib/date_picker'
import TimePicker from 'react-toolbox/lib/time_picker'
import Dropdown from 'react-toolbox/lib/dropdown'
import Input from 'react-toolbox/lib/input'

import tools from '../../logic/tools'

import OptionsFormFields from '../../booking/components/OptionsFormFields'
import InfoFormFields from '../../booking/components/InfoFormFields'

const STYLES = {
  page: {
    
  },
  half: {
    display: 'inline-block',
    width: '50%'
  },
  halffieldLeft: {
    display: 'inline-block',
    paddingRight: '10px',
    width: '50%'
  },
  halffieldRight: {
    display: 'inline-block',
    paddingLeft: '10px',
    width: '50%'
  }
}
/*

  <TimePicker 
                label='Booking Time...'
                readonly
                value={ this.props.bookingDate }
                onChange={ (val) => {
                  this.props.updateDate(val)
                } }
              />
  
*/
class BookingForm extends Component {
  render() {

    const propsslot = this.props.slot || {}

    const originalSlotIndex = propsslot.index
    const currentSlotIndex = propsslot.currentIndex || originalSlotIndex

    let hourMap = {}
    const slotOptions = this.props.slotOptions
      .filter(slot => {
        const notFilled = slot.filled ? false : true
        const isOriginalIndex = slot.index == originalSlotIndex ? true : false
        const isOriginalDate = slot.date.split(' ')[0] == propsslot.originalDate
        const isOriginalSlot = isOriginalIndex && isOriginalDate
        return notFilled || isOriginalSlot
      })
      .map(slot => {
        hourMap[slot.index] = slot.date.split(' ')[1]
        return {
          value: slot.index,
          label: slot.date.split(' ')[1] + ' - ' + slot.index
        }
      })

    return (
      <div style={ STYLES.page }>
        <div>

          <h3>Booking</h3>
          <hr />

          <div>
            <div style={ STYLES.halffieldLeft }>
              <DatePicker 
                autoOk={ true }
                label='Date'
                value={ this.props.bookingDate }
                onChange={ (val) => {
                  this.props.updateDate(val)
                } }
              />
            </div>
            <div style={ STYLES.halffieldRight }>
              <Dropdown
                auto
                label='Time'
                onChange={(val) => {
                  const newHour = hourMap[val]
                  this.props.updateSlotIndex(val, this.props.bookingDate, newHour)
                }}
                error={this.props.otherErrors.time}
                source={slotOptions}
                value={currentSlotIndex}
              />
            </div>
          </div>
          <div>
            <div style={ STYLES.halffieldLeft }>
              <Input 
                label='# Children'
                type='number'
                value={ this.props.formInfo.options.values.children || '' }
                error={ this.props.showErrors ? this.props.formInfo.options.errors.children : null }
                onChange={ (val) => {
                  this.props.updateOptionValue('children', tools.getNumValue(val))
                } }
              />
            </div>
            <div style={ STYLES.halffieldRight }>
              <Input 
                label='# Adults'
                type='number'
                value={ this.props.formInfo.options.values.adults || '' }
                error={ this.props.showErrors ? this.props.formInfo.options.errors.adults : null }
                onChange={ (val) => {
                  this.props.updateOptionValue('adults', tools.getNumValue(val))
                } }
              />
            </div>
          </div>

          <div>
            <div style={ STYLES.halffieldLeft }>
              <Input 
                label='Child Name'
                type='text'
                value={ this.props.formInfo.info.values.child_name || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.child_name : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('child_name', val)
                } }
              />
            </div>
            <div style={ STYLES.halffieldRight }>
              <Input 
                label='Your Name'
                type='text'
                value={ this.props.formInfo.info.values.name || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.name : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('name', val)
                } }
              />
            </div>
          </div>

          <div>
            <div style={ STYLES.halffieldLeft }>
              <Input 
                label='Age on Birthday'
                type='number'
                value={ this.props.formInfo.info.values.age || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.age : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('age', val)
                } }
              />
            </div>
          </div>


          <div>
            <OptionsFormFields
              blocks={ this.props.formInfo.options.blocks }
              prices={ this.props.prices }
              slot={ this.props.slot }
              admin={ true }
              formvalues={ this.props.formInfo.options.values }
              formerrors={ this.props.formInfo.options.errors }
              showErrors={ this.props.showErrors }
              updateValue={ this.props.updateOptionValue }
            />
          </div>

          

          <div>
            <Input 
              label='Notes'
              type='text'
              multiline
              value={ this.props.formInfo.info.values.notes || '' }
              onChange={ (val) => {
                this.props.updateInfoValue('notes', val)
              } }
            />
          </div>


          <h3>Contact Details</h3>
          <hr />
          
          <div>
            <div style={ STYLES.halffieldLeft }>
              <Input 
                label='Email Address'
                type='email'
                value={ this.props.formInfo.info.values.email || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.email : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('email', val)
                } }
              />
            </div>
            <div style={ STYLES.halffieldRight }>
              <Input 
                label='Mobile Number'
                type='tel'
                value={ this.props.formInfo.info.values.mobile || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.mobile : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('mobile', val)
                } }
              />
            </div>
          </div>


          <div>
            <div style={ STYLES.halffieldLeft }>
              <Input 
                label='Address'
                type='text'
                value={ this.props.formInfo.info.values.address || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.address : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('address', val)
                } }
              />
            </div>
            <div style={ STYLES.halffieldRight }>
              <Input 
                label='Postcode'
                type='text'
                value={ this.props.formInfo.info.values.postcode || '' }
                error={ this.props.showErrors ? this.props.formInfo.info.errors.postcode : null }
                onChange={ (val) => {
                  this.props.updateInfoValue('postcode', val)
                } }
              />
            </div>
          </div>

        </div>
        
      </div>
    )
  }
}

export default BookingForm