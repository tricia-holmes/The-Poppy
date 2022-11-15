import Booking from './Booking'

class Customer {
  constructor(customerData = {}, bookings = []) {
    this.id = customerData.id
    this.name = customerData.name
    this.bookings = bookings
    this.username = `customer${customerData.id}`
  }

  static fromCustomerData(customerData, bookingData) {
    const matchedBookings = bookingData
      .filter((booking) => booking.userID === customerData.id)
      .map((booking) => new Booking(booking))

    return new Customer(customerData, matchedBookings)
  }

  showPastBookings(currentDate) {
    return this.bookings
      .filter((booking) => booking.date < currentDate)
      .sort((a, b) => b.date - a.date)
  }

  showUpcomingBookings(currentDate) {
    return this.bookings
      .filter((booking) => booking.date >= currentDate)
      .sort((a, b) => a.date - b.date)
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
