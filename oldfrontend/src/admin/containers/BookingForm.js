import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'
import Navigation from 'react-toolbox/lib/navigation'
import ToolbarLayout from 'boiler-ui/lib/components/layout/Toolbar'
import Switch from 'react-toolbox/lib/switch'

import Checkbox from 'react-toolbox/lib/checkbox'
import { Button } from 'react-toolbox/lib/button'

import GenericToolbar from 'boiler-ui/lib/components/toolbars/Generic'

import dates from '../../logic/dates'
import pricestools from '../../logic/prices'
import tools from '../../logic/tools'

import { 
  getRoute
} from '../tools'

import BookingForm from '../components/BookingForm'
import BookingSummary from '../components/BookingSummary'
import formfields from '../config/formfields'
import icons from '../config/icons'
import plugins from '../plugins'
import actions from '../actions'
import selectors from '../selectors'

const STYLES = {
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  left: {
    display: 'inline-block',
    width: '30%',
    height: '100%',
    padding: '20px',
    overflow: 'auto',
    borderRight: '1px dashed #ccc'
  },
  right: {
    display: 'inline-block',
    width: '70%',
    height: '100%',
    padding: '20px',
    overflow: 'auto'
  },
  toggleIntro: {
    fontStyle: 'italic',
    fontSize: '.85em'
  },
  depositAlert: {
    padding: '5px',
    backgroundColor: '#880000',
    color: '#ffffff',
    fontWeight: 'bold',
    textDecoration: 'underline',
    fontStyle: 'italic'
  },
  depositOk: {
    padding: '5px'
  }
}

class BookingFormContainer extends Component {
  state = {
    sendEmail: true,
    sendText: true
  }

  handleSwitchChange = (field, value) => {
    this.setState({...this.state, [field]: value})
  }

  componentWillReceiveProps = (props) => {
    const phone = props.formInfo.info.values.mobile || ''
    const bookingid = props.bookingid

    if(phone.length > 0 && phone.charAt(0) != '0') {
      this.props.updateInfoValue('mobile', '0' + phone)
    }
  }

  render() {

    if(this.props.loading) {
      return (
        <div>loading...</div>
      )
    }

    if(this.props.saving) {
      return (
        <div>saving...</div>
      )
    }

    const { calendar, templates, prices, range, bookingDate } = this.props
    const dayInfo = dates.dayInfo(calendar, templates, prices, bookingDate, range) || {}

    const slotOptions = (dayInfo.blocks || []).reduce((all, block) => {
      return all.concat(block.slots)
    }, [])
    
    const toolbar = (
      <GenericToolbar title='Booking' icon={icons.booking}>
        <Navigation direction='horizontal'>
          <Button
            label='Cancel'
            icon={icons.cancel}
            ripple={true}
            onClick={() => this.props.cancel(this.props.router) }
          />
          <Button
            label='Save'
            icon={icons.save}
            ripple={true}
            raised={ this.props.hasError ? false : true }
            primary={ this.props.hasError ? false : true }
            onClick={() => this.props.saveBooking(this.props.formInfo, this.props.router)}
          />
        </Navigation>
      </GenericToolbar> 
    )

    const bookingFormProps = Object.assign({}, this.props, {
      slotOptions
    })


    const depositTaken = this.props.paymentInfo.depositTaken || 'no'

    return (
      <ToolbarLayout 
        toolbar={ toolbar }
      >

        <div style={ STYLES.container }>
          <div style={ STYLES.left }>

            <h3>Deposit & Confirmation</h3>
            <hr />
            <div>
              <p style={ depositTaken == 'no' ? STYLES.depositAlert : STYLES.depositOk }>
                Deposit of { pricestools.title(this.props.deposit) } taken?
              </p>
              <RadioGroup name='depositTaken' value={ depositTaken } onChange={ val => this.props.updatePaymentInfoValue('depositTaken', val) }>
                <RadioButton label='No' value='no' />
                <RadioButton label='Yes' value='yes' />
                <RadioButton label='Not Applicable' value='na'/>
              </RadioGroup>
            </div>
            <Switch
              checked={this.props.paymentInfo.sendEmail}
              label="Email Confirmation"
              onChange={val => this.props.updatePaymentInfoValue('sendEmail', val)}
            />
            <Switch
              checked={this.props.paymentInfo.sendText}
              label="Text Message Confirmation"
              onChange={val => this.props.updatePaymentInfoValue('sendText', val)}
            />
            <h3>Summary</h3>
            <hr />
            <BookingSummary
              bookingid={ this.props.bookingid }
              paymentInfo={ this.props.paymentInfo }
              chargeInfo={ this.props.chargeInfo }
              quoteme_blocks={ this.props.formInfo.options.blocks }
              prices={ this.props.prices }
              formvalues={ this.props.formInfo.options.values }
              slot={ this.props.slot }
              date={ this.props.bookingDate }
              formerrors={ this.props.allErrors }
              showErrors={ this.props.showErrors }
            />
          </div>
          <div style={ STYLES.right }>
            <BookingForm {...bookingFormProps} />
          </div>
        </div>

      </ToolbarLayout>
    )
  }
}


export default connect(
  (state) => {
    const bookingData = selectors.booking.data(state)

    const bookingDate = bookingData.name ? new Date(bookingData.name) : new Date()

    const formInfo = selectors.booking.formInfo(state)

    const meta = selectors.booking.meta(state)

    const otherErrors = state.core.bookingShowErrors && !(meta.slot || {}).index ? {
      time: 'A time slot is needed'
    } : {}

    const allErrors = Object.assign({}, formInfo.options.errors, formInfo.info.errors, otherErrors)
    const hasError = Object.keys(allErrors).length > 0

    return {
      bookingDate,
      meta,
      bookingid: selectors.booking.bookingid(state),
      paymentInfo: selectors.booking.paymentInfo(state),
      chargeInfo: selectors.booking.chargeInfo(state),
      slot: selectors.booking.slot(state),
      prices: selectors.booking.prices(state),
      calendar: selectors.config.calendar(state),
      templates: selectors.config.templates(state),
      deposit: selectors.config.deposit(state),
      formInfo,
      loading: state.getBooking.loading == true || state.bookingFormRange.loading == true,
      saving: state.putBooking.loading == true || state.postBooking.loading == true,
      showErrors: state.core.bookingShowErrors,
      allErrors: allErrors,
      otherErrors: otherErrors,
      hasError,
      router: state.router,
      range: selectors.search.bookingFormRange(state)
    }
  },
  (dispatch) => {
    return {  
      viewPage: (url) => {
        dispatch(actions.push(url))
      },
      updateInfoValue: (name, value) => {
        dispatch(actions.updateBooking('info', name, value))
      },
      updateBookingId: () => {
        dispatch(actions.updateBooking('root', 'bookingid', tools.makeid()))
      },
      updateSlotValue: (name, value) => {
        dispatch(actions.updateBooking('slot', name, value))
      },
      updateSlotIndex: (value, currentDate, hourst) => {

        const hour = parseInt(hourst.split(':')[0])
        const min = parseInt(hourst.split(':')[1])

        const newDate = new Date(currentDate.getTime())

        newDate.setHours(hour)
        newDate.setMinutes(min)

        

        dispatch(actions.updateBooking('slot', 'currentIndex', value))
        dispatch(actions.updateBookingDate(newDate))
      },
      updateOptionValue: (name, value) => {
        dispatch(actions.updateBooking('options', name, value))
      },
      updatePaymentInfoValue: (name, value) => {
        dispatch(actions.updateBooking('paymentInfo', name, value))
      },
      updateDate: (value) => {
        const sqldate = dates.getSQLDate(value, true)
        dispatch(actions.getBookingFormRange.request({
          date: sqldate,
          daywindow: 0
        }))
        dispatch(actions.updateBookingDate(value))
      },
      saveBooking: (formInfo, router) => {
        const allErrors = Object.assign({}, formInfo.options.errors, formInfo.info.errors)
        const saveMode = router.result.api

        if(Object.keys(allErrors).length > 0) {
          dispatch(actions.bookingShowErrors(true))
        }
        else {
          dispatch(actions.saveBooking())
        }
      },
      cancel: (router) => {
        if(router.route == getRoute('/bookings/fromcalendar/:date/:index')) {
          dispatch(actions.push('/bookings/calendar'))
        }
        else if(router.route == getRoute('/bookings/edit/calendar/:id')) {
          dispatch(actions.push('/bookings/calendar'))
        }
        else {
          dispatch(actions.push('/bookings'))
        }
      }
    }
  }
)(BookingFormContainer)