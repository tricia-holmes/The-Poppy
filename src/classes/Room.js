import Booking from './Booking'

class Room {
  constructor(roomData = {}, bookings = []) {
    this.number = roomData.number
    this.roomType = roomData.roomType
    this.bidet = roomData.bidet
    this.bedSize = roomData.bedSize
    this.numBeds = roomData.numBeds
    this.costPerNight = roomData.costPerNight
    this.bookings = bookings
  }

  static fromRoomData(roomData, bookingData) {
    const matchedBookings = bookingData
      .filter((booking) => booking.roomNumber === roomData.number)
      .map((booking) => new Booking(booking))

    return new Room(roomData, matchedBookings)
  }

  isAvailable(arrivalDate, depatureDate) {
    const foundBooking = this.bookings.find(
      (booking) =>
        booking.date.getTime() >= arrivalDate.getTime() &&
        booking.date.getTime() <= depatureDate.getTime()
    )

    return !foundBooking
  }

  book(newBooking) {
    this.bookings.push(new Booking(newBooking))
  }
}

export default Room
