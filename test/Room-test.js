import chai from 'chai'
import { roomSampleData } from '../test-data/room-sample-data'
import {
  bookingSampleData,
  bookingSampleData2,
} from '../test-data/booking-sample-data'
import Room from '../src/classes/Room'
import Booking from '../src/classes/Booking'
const expect = chai.expect

describe('Room', () => {
  let room1, room2, room3, newBooking

  beforeEach(() => {
    room1 = Room.fromRoomData(roomSampleData[0], bookingSampleData)
    room2 = Room.fromRoomData(roomSampleData[1], bookingSampleData)
    room3 = new Room()
    newBooking = new Booking(bookingSampleData2)
  })

  it('should be a function', () => {
    expect(Room).to.be.a('function')
  })

  it('should be an instance of Room', () => {
    expect(room1).to.be.an.instanceOf(Room)
  })

  it('should have a number', () => {
    expect(room1.number).to.equal(4)
  })

  it('should have a room type', () => {
    expect(room1.roomType).to.equal('single room')
  })

  it('should tell you whether it has a bidet or not', () => {
    expect(room1.bidet).to.equal(false)
  })

  it('should have a bedsize', () => {
    expect(room1.bedSize).to.equal('queen')
  })

  it('should have the number of beds included', () => {
    expect(room1.numBeds).to.equal(1)
  })

  it('should have the cost per night', () => {
    expect(room1.costPerNight).to.equal(429.44)
  })

  it('should have a list of bookings', () => {
    expect(room2.bookings).to.deep.equal([
      {
        id: '5fwrgu4i7k55hl6tm',
        userID: 41,
        date: '2022/11/10',
        roomNumber: 19,
      },
    ])
  })

  it('each booking should be an instance of booking', () => {
    expect(room1.bookings[1]).to.be.an.instanceOf(Booking)
    expect(room2.bookings[0]).to.be.an.instanceOf(Booking)
  })

  it("should default properties to undefined if data is'nt given", () => {
    expect(room3).to.deep.equal({
      number: undefined,
      roomType: undefined,
      bidet: undefined,
      bedSize: undefined,
      numBeds: undefined,
      costPerNight: undefined,
      bookings: [],
    })
  })

  it('should have a way to tell if a room is available for a given date range', () => {
    expect(room1.isAvailable('2025/10/07')).to.deep.equal(true)
  })

  it('should have a way to tell if a room is not available for a given date range', () => {
    expect(room2.isAvailable('2022/11/10')).to.deep.equal(false)
  })

  it('should be able to add a new booking', () => {
    room2.book(newBooking)
    expect(room2.bookings).to.deep.equal([
      {
        id: '5fwrgu4i7k55hl6tm',
        userID: 41,
        date: '2022/11/10',
        roomNumber: 19,
      },
      {
        id: '5fth8u4i7k55hl6t7',
        userID: 22,
        date: '2029/11/10',
        roomNumber: 19,
      },
    ])
  })
})
