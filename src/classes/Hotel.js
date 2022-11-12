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

  isValidDate(customerSelectedDate) {
    const currentDate = new Date()
    
    return customerSelectedDate >= currentDate
  }
  
  showAvailableRooms(selectedDate) {
    const customerSelectedDate = new Date(selectedDate)
    if (this.isValidDate(customerSelectedDate)) {
      return this.rooms.filter((room) => room.isAvailable(customerSelectedDate))
    }

    return 'Sorry that date has already past! Please select another!'
  }

  addBooking(roomNumber, newBooking, customer) {
    const selectedRoom = this.rooms.find((room) => room.number === roomNumber)

    selectedRoom.book(newBooking)
    customer.makeBooking(newBooking)
    this.bookings.push(newBooking)
  }
}

export default Hotel
