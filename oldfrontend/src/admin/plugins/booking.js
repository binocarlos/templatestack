import TablePlugin from 'boiler-ui/lib/plugins/table'
import FormPlugin from 'boiler-ui/lib/plugins/form'

import { getPathnameValue } from 'boiler-ui/lib/tools'

import SearchPlugin from 'boiler-ui/lib/plugins/search'

import schemas from '../config/schemas'
import apis from '../apis'

const getItemTitle = getPathnameValue('name')
const getTableTitle = () => 'Bookings'
const getFormTitle = (item) => 'Booking'

const names = {
  table: 'BOOKING_TABLE',
  form: 'BOOKING_FORM',
  search: 'BOOKING_SEARCH'
}

const search = SearchPlugin({
  name: names.search,
  delay: 300,
  selector: state => state.booking.search
})

const table = TablePlugin({
  name: names.table,
  apis: apis.booking,
  selector: state => state.booking.table
})

const sagas = [
  search.saga
]

const booking = {
  getItemTitle,
  getTableTitle,
  getFormTitle,
  names,
  table,
  search,
  sagas
}

export default booking