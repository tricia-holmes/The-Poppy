import chai from 'chai'
import { customerSampleData } from '../test-data/customer-sample-data'
import { bookingSampleData } from '../test-data/booking-sample-data'
import { roomSampleData } from '../test-data/room-sample-data'
import Customer from '../src/classes/Customer'
const expect = chai.expect

describe('Customer', () => {
  let customer1, customer2, customer3, customer4

  beforeEach(() => {
    customer1 = Customer.fromCustomerData(
      customerSampleData[0],
      bookingSampleData
    )
    ;(customer2 = Customer.fromCustomerData(
      customerSampleData[1],
      bookingSampleData
    )),
      (customer3 = new Customer()),
      (customer4 = Customer.fromCustomerData(
        customerSampleData[2],
        bookingSampleData
      ))
  })

  it('should be function', () => {
    expect(Customer).to.be.a('function')
  })

  it('should be an instance of Customer', () => {
    expect(customer1).to.be.an.instanceOf(Customer)
    expect(customer3).to.be.an.instanceOf(Customer)
  })

  it('should have an id', () => {
    expect(customer1.id).to.equal(41)
    expect(customer2.id).to.equal(23)
  })

  it('should have id default to undefined if customer data is undefined', () => {
    expect(customer3.id).to.equal(undefined)
  })

  it('should have a name', () => {
    expect(customer1.name).to.equal('Francisca Trantow')
    expect(customer2.name).to.equal('Angus Swift')
  })

  it('should have name default to undefined if customer data is undefined', () => {
    expect(customer3.name).to.equal(undefined)
  })

  it('should have a list of bookings that matches the id', () => {
    expect(customer1.bookings).to.deep.equal([
      {
        id: '5fwrgu4i7k55hl6tm',
        userID: 41,
        date: '2022/11/10',
        roomNumber: 19,
      },
      {
        id: '5fwrgu4i7k55hl6um',
        userID: 41,
        date: '2021/02/07',
        roomNumber: 4,
      },
      {
        id: '5fo6gu4i7k55hl6um',
        userID: 41,
        date: '2023/10/07',
        roomNumber: 4,
      },
    ])
  })
  it('should not have bookings that do not match the id', () => {
    expect(customer4.bookings).to.deep.equal([])
  })

  it('should default to an empty array if bookings is undefined', () => {
    expect(customer3.bookings).to.deep.equal([])
  })

  it("should be able to show the customer's past bookings", () => {
    expect(customer1.showPastBookings()).to.deep.equal([
      {
        id: '5fwrgu4i7k55hl6um',
        userID: 41,
        date: '2021/02/07',
        roomNumber: 4,
      },
    ])
  })

  it("should not include current day bookings in the customer's past bookings", () => {
    expect(customer4.showPastBookings()).to.deep.equal([])
  })

  it("should be able to show the customer's current and upcoming books", () => {
    expect(customer1.showUpcomingBookings()).to.deep.equal([
      {
        id: '5fwrgu4i7k55hl6tm',
        userID: 41,
        date: '2022/11/10',
        roomNumber: 19,
      },
      {
        id: '5fo6gu4i7k55hl6um',
        userID: 41,
        date: '2023/10/07',
        roomNumber: 4,
      },
    ])
  })

  it("should be able to get total cost of all the customer's bookings", () => {
    expect(customer1.getTotalCost(roomSampleData)).to.equal(1233.55)
  })

  it('should return 0 if custome has no bookings', () => {
    expect(customer3.getTotalCost(roomSampleData)).to.equal(0)
    expect(customer4.getTotalCost(roomSampleData)).to.equal(0)
  })

  // create test once add booking method gets created!
})
