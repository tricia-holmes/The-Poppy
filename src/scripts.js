// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

import Customer from './classes/Customer'
import Hotel from './classes/Hotel'
import {
  bookingSampleData,
  bookingSampleData2,
} from '../test-data/booking-sample-data'
import { roomSampleData } from '../test-data/room-sample-data'
import { customerSampleData } from '../test-data/customer-sample-data'

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/fonts.css'
import './css/variables.css'
import './css/styles.css'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/test-hotel.jpg'
import './images/test-hotel2.jpg'
import './images/test-hotel3.jpg'
import './images/test-hotel4.jpg'
import './images/test-hotel5.jpg'

//--------------Query Selectors------------------
const customerNameDisplay = document.querySelector('[data-id = customerName]')
const customerIdDisplay = document.querySelector('[data-id = customerId]')
const customerToalSpentDisplay = document.querySelector('[data-id = totalCost]')
const upcomingBookingsContainer = document.querySelector(
  '[data-id = UpcomingBookings]'
)
const pastBookingsContainer = document.querySelector('[date-id = pastBookings]')

//--------------Global Variables------------------
const store = {
  currentDate: '',
  customer: new Customer(),
  hotel: new Hotel(),
  bookingImages: [
    'test-hotel.jpg',
    'test-hotel2.jpg',
    'test-hotel3.jpg',
    'test-hotel4.jpg',
    'test-hotel4.jpg',
  ],
}

//--------------Event Listeners------------------
window.addEventListener('load', () => {
  createRandomCustomer(customerSampleData, bookingSampleData)
  createHotel(roomSampleData, bookingSampleData)
})

window.addEventListener('load', () => {
  loadCustomerProfile()
})

window.addEventListener('load', () => {
  loadTotalAmountSpent()
})

window.addEventListener('load', () => {
  createCurrentDate()
})

window.addEventListener('load', () => {
  loadUpcomingBookings()
})

window.addEventListener('load', () => {
  loadPastBookings()
})

//--------------Event Handlers------------------
const createRandomCustomer = (customerSampleData, bookingSampleData) => {
  const customerIndex = randomizeFromArray(customerSampleData)
  store.customer = Customer.fromCustomerData(
    customerSampleData[customerIndex],
    bookingSampleData
  )
}

const createHotel = (roomSampleData, bookingSampleData) => {
  const hotelInfo = Hotel.fromData(roomSampleData, bookingSampleData)
  store.hotel = hotelInfo
}

const loadUpcomingBookings = () => {
  const upcomingBookings = store.customer.showUpcomingBookings(
    store.currentDate
  )

  upcomingBookings.forEach((upcomingBooking) => {
    // create function for creating html elements
    const booking = document.createElement('div')
    const bookingFigure = document.createElement('figure')
    const bookingImg = document.createElement('img')
    const reservation = document.createElement('p')
    const reservationNumber = document.createElement('span')
    const bookingDate = document.createElement('p')
    const date = document.createElement('span')

    // create function for creating css classes
    booking.classList.add('booking')
    bookingFigure.classList.add('booking__figure')
    bookingImg.classList.add('booking__img')
    reservation.classList.add('booking__label')
    reservationNumber.classList.add('placeholder')
    bookingDate.classList.add('booking__label')
    date.classList.add('placeholder')

    // create function for inputting data
    booking.dataset.id = `${upcomingBooking.id}`
    bookingImg.src = `../images/${getRandomImage()}`
    reservation.innerText = 'Reservation Number:'
    reservationNumber.innerText = ` ${upcomingBooking.id}`
    bookingDate.innerText = 'Booking Date:'
    date.innerText = ` ${upcomingBooking.date}`

    // create function for appending elements
    bookingFigure.appendChild(bookingImg)
    booking.appendChild(bookingFigure)
    reservation.appendChild(reservationNumber)
    booking.appendChild(reservation)
    bookingDate.appendChild(date)
    booking.appendChild(bookingDate)
    upcomingBookingsContainer.appendChild(booking)
  })
}

const loadPastBookings = () => {
  const pastBookings = store.customer.showPastBookings(store.currentDate)

  pastBookings.forEach((booking) => {
    const pastBooking = document.createElement('div')
    const pastDate = document.createElement('p')

    pastBooking.classList.add('pastBooking')
    pastDate.classList.add('pastDate')

    pastBooking.style.backgroundImage = `url(../images/${getRandomImage()})`
    pastDate.innerText = `${booking.date}`

    pastBooking.appendChild(pastDate)
    pastBookingsContainer.appendChild(pastBooking)
  })
}

const loadCustomerProfile = () => {
  customerNameDisplay.innerText = `${store.customer.name}`
  customerIdDisplay.innerText = `${store.customer.id}`
}

const loadTotalAmountSpent = () => {
  const total = store.customer.getTotalCost(store.hotel)
  const totalFormatted = formatForCurrency(total)
  customerToalSpentDisplay.innerText = `${totalFormatted}`
  console.log(store.customer.bookings)
}

//--------------Util Functions-------------------
const randomizeFromArray = (array) => {
  return Math.floor(Math.random() * array.length)
}

const getRandomImage = () => {
  return store.bookingImages[randomizeFromArray(store.bookingImages)]
}

const formatForCurrency = (amount) => {
  const formatCurrency = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  })
  return formatCurrency.format(amount)
}

const createCurrentDate = () => {
  store.currentDate = `${new Date().getFullYear()}/${
    new Date().getMonth() + 1
  }/${new Date().getDate()}`
}
