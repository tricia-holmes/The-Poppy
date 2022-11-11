class Customer {
  constructor(customerData = {}, bookings = []) {
    this.id = customerData.id, 
    this.name = customerData.name,
    this.bookings = bookings
  }

  static fromCustomerData(customerData, bookingData) {
    const matchedBookings = bookingData.filter(
      (booking) => booking.userID === customerData.id
    )

    const bookings = matchedBookings.map((matchedBooking) => {
      return {
        id: matchedBooking.id,
        userID: matchedBooking.userID,
        date: matchedBooking.date,
        roomNumber: matchedBooking.roomNumber,
      } // change this to an instance of booking once class is created
    })
    return new Customer(customerData, bookings)
  }

  showPastBookings() {
    const newDate = new Date()
    const currentDate = `${newDate.getFullYear()}/${newDate.getMonth()+1}/${newDate.getDate()}`
    return this.bookings.filter(booking => booking.date < currentDate)  
  }

  showUpcomingBookings() {
    const newDate = new Date()
    const currentDate = `${newDate.getFullYear()}/${newDate.getMonth()+1}/${newDate.getDate()}`
    return this.bookings.filter(booking => booking.date >= currentDate)  
  }

  getTotalCost(roomData) {
    return this.bookings.reduce((total, booking) => {
      roomData.forEach(roomData => {
        if (booking.roomNumber === roomData.number) {
          total += roomData.costPerNight
        }
      })
      return total
    }, 0)
  }

  // add booking method when I create hotel and book classes
}
export default Customer
