import chai from 'chai'
import { roomSampleData } from '../test-data/room-sample-data'
import {
  bookingSampleData,
  bookingSampleData2,
} from '../test-data/booking-sample-data'
import { customerSampleData } from '../test-data/customer-sample-data'
import Hotel from '../src/classes/Hotel'
import Room from '../src/classes/Room'
import Booking from '../src/classes/Booking'
import Customer from '../src/classes/Customer'
const expect = chai.expect

describe('Hotel', () => {
  let hotel, emptyHotel, customer, newBooking

  beforeEach(() => {
    hotel = Hotel.fromData(roomSampleData, bookingSampleData, customerSampleData)
    emptyHotel = new Hotel()
    customer = Customer.fromCustomerData(
      customerSampleData[2],
      bookingSampleData
    )
    newBooking = new Booking(bookingSampleData2)
  })

  it('should be a function', () => {
    expect(Hotel).to.be.a('function')
  })

  it('should be an instance of Customer', () => {
    expect(hotel).to.be.an.instanceOf(Hotel)
  })

  it('should have a list of rooms', () => {
    expect(hotel.rooms).to.deep.equal([
      {
        number: 4,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 429.44,
        bookings: [
          {
            id: '5fwrgu4i7k55hl6um',
            userID: 41,
            date: new Date('2021/02/07'),
            roomNumber: 4,
          },
          {
            id: '5fo6gu4i7k55hl6um',
            userID: 41,
            date: new Date('2023/10/07'),
            roomNumber: 4,
          },
          {
            id: '5fwrgu4i7k55hl6xm',
            userID: 23,
            date: new Date('2023/12/16'),
            roomNumber: 4,
          },
        ],
      },
      {
        number: 19,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 374.67,
        bookings: [
          {
            id: '5fwrgu4i7k55hl6tm',
            userID: 41,
            date: new Date('2022/11/10'),
            roomNumber: 19,
          },
        ],
      },
      {
        number: 7,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 231.46,
        bookings: [
          {
            id: '5fwrgu4i7k55hl6t7',
            userID: 20,
            date: new Date('2022/11/10'),
            roomNumber: 7,
          },
        ],
      },
      {
        number: 24,
        roomType: 'suite',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 327.24,
        bookings: [],
      },
    ])
  })

  it('each room should be an instance of room', () => {
    expect(hotel.rooms[1]).to.be.an.instanceOf(Room)
  })

  it('should default to an empty array if room data is undefined', () => {
    expect(emptyHotel.rooms).to.deep.equal([])
  })

  it('should have a list of bookings', () => {
    expect(hotel.bookings).to.deep.equal([
      {
        id: '5fwrgu4i7k55hl6tm',
        userID: 41,
        date: new Date('2022/11/10'),
        roomNumber: 19,
      },
      {
        id: '5fwrgu4i7k55hl6um',
        userID: 41,
        date: new Date('2021/02/07'),
        roomNumber: 4,
      },
      {
        id: '5fo6gu4i7k55hl6um',
        userID: 41,
        date: new Date('2023/10/07'),
        roomNumber: 4,
      },
      {
        id: '5fwrgu4i7k55hl6xm',
        userID: 23,
        date: new Date ('2023/12/16'),
        roomNumber: 4,
      },
      {
        id: '5fwrgu4i7k55hl6t7',
        userID: 20,
        date: new Date('2022/11/10'),
        roomNumber: 7,
      },
    ])
  })

  it('each booking should be an instance of booking', () => {
    expect(hotel.bookings[2]).to.be.an.instanceOf(Booking)
  })

  it('should default to an empty array if booking data is undefined', () => {
    expect(emptyHotel.bookings).to.deep.equal([])
  })

  it('should be able to check if a selected date is vaild and not past due', () => {
    expect(hotel.isValidDate(new Date('2025/12/05'), new Date(), new Date('2025/12/09'))).to.equal(true)
  })

  it('should be able to check if a selected date is not vaild and past due', () => {
    expect(hotel.isValidDate(new Date('2022/12/05'), new Date(), new Date('2021/12/09'))).to.equal(false)
  })

  it('should be able to show what rooms are available for a given date', () => {
    expect(hotel.showAvailableRooms(new Date('2023/12/16'), new Date(), new Date('2023/12/16'))).to.deep.equal([
      {
        number: 19,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 374.67,
        bookings: [
          {
            id: '5fwrgu4i7k55hl6tm',
            userID: 41,
            date: new Date('2022/11/10'),
            roomNumber: 19,
          },
        ],
      },
      {
        number: 7,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 231.46,
        bookings: [
          {
            id: '5fwrgu4i7k55hl6t7',
            userID: 20,
            date: new Date('2022/11/10'),
            roomNumber: 7,
          },
        ],
      },
      {
        number: 24,
        roomType: 'suite',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 327.24,
        bookings: [],
      },
    ])
  })

  it('should show no available rooms for past due dates', () => {
    expect(hotel.showAvailableRooms(new Date('2021/11/07'), new Date(), new Date('2021/11/07'))).to.deep.equal(
      'Sorry that date has already past! Please select another!'
    )
  })

  it('should show no rooms available when the hotel has no rooms created', () => {
    expect(emptyHotel.showAvailableRooms(new Date('2023/11/07'), new Date(), new Date('2023/11/07'))).to.deep.equal([])
  })

  it('should be able to add bookings for customers and reserve those rooms', () => {
    hotel.addBooking(newBooking, customer)
    const selectedRoom = hotel.rooms.find(
      (room) => room.number === newBooking.roomNumber
    )

    expect(hotel.bookings).to.deep.include(newBooking)
    expect(selectedRoom.bookings).to.deep.include(newBooking)
    expect(customer.bookings).to.deep.include(newBooking)
  })
})
