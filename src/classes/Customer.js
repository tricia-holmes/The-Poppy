import Booking from './Booking'

class Customer {
  constructor(customerData = {}, bookings = []) {
    this.id = customerData.id
    this.name = customerData.name
    this.bookings = bookings
  }

  static fromCustomerData(customerData, bookingData) {
    const matchedBookings = bookingData
      .filter((booking) => booking.userID === customerData.id)
      .map((booking) => new Booking(booking))

    return new Customer(customerData, matchedBookings)
  }

  showPastBookings() {
    const newDate = new Date() // change this to be a global variable passed in
    const currentDate = `${newDate.getFullYear()}/${
      newDate.getMonth() + 1
    }/${newDate.getDate()}`
    return this.bookings.filter((booking) => booking.date < currentDate)
  }

  showUpcomingBookings() {
    const newDate = new Date() // change this to be a global variable passed in
    const currentDate = `${newDate.getFullYear()}/${
      newDate.getMonth() + 1
    }/${newDate.getDate()}`
    return this.bookings.filter((booking) => booking.date >= currentDate)
  }

  getTotalCost(hotel) {
    return this.bookings.reduce((total, booking) => {
      hotel.rooms.forEach((hotelRoom) => {
        if (booking.roomNumber === hotelRoom.number) {
          total += hotelRoom.costPerNight
        }
      })
      return total
    }, 0)
  }

  makeBooking(booking) {
    this.bookings.push(booking)
  }
}
export default Customer
