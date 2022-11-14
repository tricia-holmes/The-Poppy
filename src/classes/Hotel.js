import Booking from './Booking'
import Room from './Room'

class Hotel {
  constructor(rooms = [], bookings = []) {
    this.rooms = rooms
    this.bookings = bookings
  }

  static fromData(roomsData, bookingData) {
    const rooms = roomsData.map((room) => {
      return Room.fromRoomData(room, bookingData)
    })

    const bookings = bookingData.map((booking) => {
      return new Booking(booking)
    })

    return new Hotel(rooms, bookings)
  }

  findRoomByNumber(roomNumber) {
    return this.rooms.find(room => room.number === roomNumber)
  }

  filterRoomsByRoomType(type, availabelRooms) {
    return availabelRooms.filter(room => room.roomType === type)
  }

  isValidDate(arrivalDate, currentDate, depatureDate) {
    return (
      depatureDate.getTime() >= arrivalDate.getTime() &&
      arrivalDate.getTime() >= currentDate.getTime()
    )
  }

  showAvailableRooms(arrivalDate, currentDate, depatureDate) {
    if (this.isValidDate(arrivalDate, currentDate, depatureDate)) {
      return this.rooms.filter((room) =>
        room.isAvailable(arrivalDate, depatureDate)
      )
    }

    return 'Sorry that date has already past! Please select another!'
  }

  addBooking(newBooking, customer) {
    const selectedRoom = this.rooms.find((room) => room.number === newBooking.roomNumber)

    selectedRoom.book(newBooking)
    customer.makeBooking(newBooking)
    this.bookings.push(newBooking)
  }
}

export default Hotel
