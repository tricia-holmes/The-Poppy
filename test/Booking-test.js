import chai from 'chai'
import { bookingSampleData } from '../test-data/booking-sample-data'
import Booking from '../src/classes/Booking'
const expect = chai.expect

describe('Booking', () => {
  let booking1, booking2, booking3

  beforeEach(() => {
    booking1 = new Booking(bookingSampleData[0])
    booking2 = new Booking(bookingSampleData[3])
    booking3 = new Booking()
  })

  it('should be a function', () => {
    expect(Booking).to.be.a('function')
  })

  it('should be an instance of Booking', () => {
    expect(booking1).to.be.an.instanceOf(Booking)
    expect(booking2).to.be.an.instanceOf(Booking)
  })

  it('should have an id', () => {
    expect(booking1.id).to.equal('5fwrgu4i7k55hl6tm')
    expect(booking2.id).to.equal('5fwrgu4i7k55hl6xm')
  })

  it('should have a user id', () => {
    expect(booking1.userID).to.equal(41)
    expect(booking2.userID).to.equal(23)
  })

  it('should have a booking date', () => {
    expect(booking1.date).to.equal('2022/11/10')
    expect(booking2.date).to.equal('2023/12/16')
  })

  it('should have a room number for the booking', () => {
    expect(booking1.roomNumber).to.equal(19)
    expect(booking2.roomNumber).to.equal(4)
  })

  it('should default to an undefined properties if no data is given', () => {
    expect(booking3).to.deep.equal({
      id: undefined,
      userID: undefined,
      date: undefined,
      roomNumber: undefined,
    })
  })
})
