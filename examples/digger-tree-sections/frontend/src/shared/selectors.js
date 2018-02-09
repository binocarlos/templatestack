import dateLight from 'template-tools/src/utils/dateLight'

const bookingForm = {
  calendarConfig: (data) => data.meta.calendarConfig.data,
  defaultCalendarDate: (data) => {
    const config = bookingForm.calendarConfig(data)
    let useDate = config.time_window && config.time_window.start ? new Date(config.time_window.start) : new Date()
    if(config.time_window && config.time_window.end) {
      const checkEnd = new Date(config.time_window.end)
      if(useDate.getTime() > checkEnd.getTime()) {
        useDate = checkEnd
      }
    }
    return dateLight.sqlDate(useDate, true)
  }
}

const selectors = {
  bookingForm,
}

export default selectors