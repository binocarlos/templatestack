import React, { Component, PropTypes } from 'react'
import Fragment from 'boiler-ui/lib/containers/Fragment'
import routerActions from 'boiler-ui/lib/actions/router'

import Login from './containers/Login'
import Register from './containers/Register'

import BookingTree from './containers/BookingTree'
import BookingTable from './containers/BookingTable'
import BookingSchedule from './containers/BookingSchedule'
import BookingCalendar from './containers/BookingCalendar'
import BookingForm from './containers/BookingForm'

import Home from './components/Home'
import Help from './components/Help'
import About from './components/About'

import actions from './actions'
import plugins from './plugins'
import selectors from './selectors'

import dates from '../logic/dates'

// these tools map in the basepath onto any of the routes
// the basepath is the mountpoint of the app (e.g. '/app' or '/admin')
import { 
  routeProcessor,
  getRoute,
  homeRouteMatcher
} from './tools'

const guest = (route) => {
  return Object.assign({}, route, {
    requireGuest: getRoute('/')
  })
}

const user = (route) => {
  return Object.assign({}, route, {
    requireUser: getRoute('/')
  })
}

/*

  ROUTE CONFIG
  
*/

export const routes = routeProcessor({
  '': {},
  '/': {},
  '/help': {},
  '/about': {},
  '/login': guest({}),
  '/register': guest({}),
  '/test': {},
  '/bookings': user({
    '/schedule': {
      
    },
    '/calendar': {
      
    },
    '/add': {
      api: 'post'
    },
    '/fromcalendar/:date/:index': {
      api: 'post'
    },
    '/edit/:id': {
      api: 'put'
    },
    '/edit/calendar/:id': {
      api: 'put'
    }
  })
})

/*

  DATA HANDLERS
  
*/

export const triggerHandlers = {

  loadBookings: (state, initial) => [
    plugins.booking.table.actions.selection.set([]),
    plugins.booking.table.actions.list.request()
  ],
  searchBookings: (state, initial) => [
    plugins.booking.table.actions.selection.set([]),
    plugins.booking.table.actions.list.request({
      qs: {
        search: selectors.search.text(state),
        all: selectors.search.all(state) ? 'y' : 'n',
        from: dates.getSQLDate(selectors.search.from(state), true),
        to: dates.getSQLDate(selectors.search.to(state), true)
      }
    })
  ],
  loadCalendarRange: (state, initial) => {
    let w = selectors.search.calendarWindow(state)
    w--
    if(w<0) w = 0
    if(isNaN(w)) {
      w = 0
    }
    return [
      actions.getCalendarRange.request({
        date: dates.getSQLDate(selectors.search.calendarDate(state), true),
        daywindow: w
      })
    ]
  },
  loadScheduleRange: (state, initial) => [
    actions.getScheduleRange.request({
      qs: {
        from: dates.getSQLDate(selectors.search.scheduleFrom(state), true),
        to: dates.getSQLDate(dates.dateDelta(selectors.search.scheduleTo(state), 1), true)
      }
    })
  ],
  addBooking: (state, initial) => {
    return [
      actions.resetBooking(),
      actions.bookingShowErrors(false),
      actions.getBookingFormRange.request({
        date: dates.getSQLDate(new Date(), true),
        daywindow: 0
      })
    ]
  },
  fromCalendar: (state, initial) => [
    actions.bookingShowErrors(false),
    actions.getBookingFormRange.request({
      date: dates.getSQLDate(state.router.params.date, true),
      daywindow: 0
    })
  ],
  editBooking: (state, initial) => [
    actions.resetBooking(),
    actions.getBooking.request(state.router.params),
    actions.bookingShowErrors(false)
  ],
  bookingSaved: (state, initial) => {

    let ret = []
    if(state.router.route == getRoute('/bookings/fromcalendar/:date/:index')) {
      ret.push(actions.push('/bookings/calendar'))
    }
    else if(state.router.route == getRoute('/bookings/edit/calendar/:id')) {
      ret.push(actions.push('/bookings/calendar'))
    }
    else {
      ret.push(actions.push('/bookings'))
    }

    ret = ret.concat([
      actions.resetBooking(),
      actions.bookingShowErrors(false),
      plugins.snackbar.actions.open({
        message: 'Booking saved...'
      })
    ])

    return ret
  }
}

/*

  ROUTE TRIGGERS
  
*/

const routeTriggers = {

  [getRoute('/bookings')]: [triggerHandlers.searchBookings],
  [getRoute('/bookings/calendar')]: [triggerHandlers.loadCalendarRange],
  [getRoute('/bookings/schedule')]: [triggerHandlers.loadScheduleRange],
  [getRoute('/bookings/add')]: [triggerHandlers.addBooking],
  [getRoute('/bookings/fromcalendar/:date/:index')]: [triggerHandlers.fromCalendar],
  [getRoute('/bookings/edit/calendar/:id')]: [triggerHandlers.editBooking],
  [getRoute('/bookings/edit/:id')]: [triggerHandlers.editBooking]
}

/*

  DATA TRIGGERS

  how we hook up one event happening to another action triggering
  
*/

export const dataTriggers = {

  [plugins.booking.table.actions.reload.types.trigger]: [
    triggerHandlers.searchBookings
  ],

  [actions.putBooking.types.success]: [
    triggerHandlers.bookingSaved
  ],

  [actions.postBooking.types.success]: [
    triggerHandlers.bookingSaved
  ],

  [plugins.booking.search.actions.submit.types.trigger]: [
    triggerHandlers.searchBookings
  ],

  [actions.types.updateSearch]: [
    triggerHandlers.searchBookings
  ],

  [actions.types.updateCalendarSearch]: [
    triggerHandlers.loadCalendarRange
  ],

  [actions.types.updateScheduleSearch]: [
    triggerHandlers.loadScheduleRange
  ]

}

// the action we use to redirect the resource root page to /resources/user/root
const RESOURCES_ROOT_REDIRECT = 'RESOURCES_ROOT_REDIRECT'
const resourceRootRedirector = routerActions.redirect(RESOURCES_ROOT_REDIRECT)

// actions we trigger when a route is loaded
// return an array of actions that are emitted
export const getRouteActions = (state, initial) => {
  const routerState = state.router
  const route = routerState.route

  let getTriggerFns = []

  if(initial) {
    // filters when the app initially loads go here
  }

  // static route matching
  if(routeTriggers[route]) {
    getTriggerFns = getTriggerFns.concat(routeTriggers[route])
  }

  const triggerActions = getTriggerFns.reduce((all, fn) => {
    return all.concat(fn(state, initial))
  }, [])

  return triggerActions
}

/*

  REDIRECTORS
  
*/

// buttons clicked in components can emit the 'ROUTER_REDIRECT' action
// the action has
//  * base     - the action set (e.g. INSTALLATION_TABLE)
//  * name     - the action itself (e.g. edit)
//  * payload  - additional data (e.g. {id:10})

const push = actions.router.push

export const redirectors = {

  // CLIENTS
  [plugins.booking.names.table]: {
    add: (payload, state) => push(getRoute('/bookings/add')),
    edit: (payload, state) => push(getRoute('/bookings/edit/' + payload.id))
  },

  [plugins.booking.names.form]: {
    cancel: (payload, state) => {
      if(state.router.route == getRoute('/bookings/fromcalendar/:date/:index')) {
        push(getRoute('/bookings/calendar'))
      }
      else {
        push(getRoute('/bookings'))  
      }
    },
    saved: (payload, state) => {
      if(state.router.route == getRoute('/bookings/fromcalendar/:date/:index')) {
        push(getRoute('/bookings/calendar'))
      }
      else if(state.router.route == getRoute('/bookings/edit/calendar/:id')) {
        push(getRoute('/bookings/calendar'))
      }
      else {
        push(getRoute('/bookings'))  
      }
    }
  }

}

// relative strips the basepath from the current url
export const fragments = (relative) => {
  const compareRoute = (route) => (pathname) => relative(pathname) == route
  return (
    <div className='routeWrapper'>

      <Fragment forRoute={getRoute('')} exact>
        <Home />
      </Fragment>

      <Fragment forRoute={getRoute('/')} exact>
        <Home />
      </Fragment>

      <Fragment forRoute={getRoute('/login')}>
        <Login />
      </Fragment>

      <Fragment forRoute={getRoute('/register')}>
        <Register />
      </Fragment>

      <Fragment forRoute={getRoute('/help')}>
        <Help />
      </Fragment>

      <Fragment forRoute={getRoute('/about')}>
        <About />
      </Fragment>

      <Fragment forRoute={getRoute('/bookings')}>

        <BookingTree>

          <Fragment forRoute={getRoute('/bookings')} exact>
            <BookingTable
              searchSelector={plugins.booking.search.selectors.container}
              searchDispatcher={plugins.booking.search.actions.dispatcher}
            />
          </Fragment>

          <Fragment forRoute={getRoute('/bookings/schedule')}>
            <BookingSchedule
             
            />
          </Fragment>

          <Fragment forRoute={getRoute('/bookings/calendar')}>
            <BookingCalendar
             
            />
          </Fragment>

          <Fragment forRoute={getRoute('/bookings/add')}>
            <BookingForm
             
            />
          </Fragment>

          <Fragment forRoute={getRoute('/bookings/edit/:id')}>
            <BookingForm
             
            />
          </Fragment>

          <Fragment forRoute={getRoute('/bookings/edit/calendar/:id')}>
            <BookingForm
             
            />
          </Fragment>

          <Fragment forRoute={getRoute('/bookings/fromcalendar/:date/:index')}>
            <BookingForm
             
            />
          </Fragment>

        </BookingTree>
        
      </Fragment>

    </div>
  )
}

export default {
  routes,
  getRouteActions,
  fragments
}