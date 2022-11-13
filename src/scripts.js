// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import { fetchGetAll } from './apiCalls'
import Customer from './classes/Customer'
import Hotel from './classes/Hotel'

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
import './images/test-room.jpg'
import './images/dollar.svg'
import './images/room.svg'
import './images/bed.svg'
import './images/bidet.svg'

//--------------Query Selectors------------------
const customerNameDisplay = document.querySelector('[data-id = customerName]')
const customerIdDisplay = document.querySelector('[data-id = customerId]')
const customerToalSpentDisplay = document.querySelector('[data-id = totalCost]')
const upcomingBookingsContainer = document.querySelector(
  '[data-id = UpcomingBookings]'
)
const pastBookingsContainer = document.querySelector('[date-id = pastBookings]')
const navBtn = document.querySelector('[data-id = navbar]')
const userDashboardSection = document.querySelector(
  '[data-page-type = user-dashboard]'
)
const reservationsPageSection = document.querySelector(
  '[data-page-type = reservations]'
)
const resultsContainer = document.querySelector('[data-id = results]')

//--------------Global Variables------------------
const store = {
  currentPage: 'user dashboard',
  currentDate: new Date(),
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

//--------------Initialize App------------------
const InitializeCustomerApp = () => {
  fetchGetAll()
    .then((data) => {
      store.customer = createRandomCustomer(data.customerData, data.bookingData)
      store.hotel = createHotel(data.roomData, data.bookingData)
      defineEventListeners()
      loadCustomerProfile()
      loadTotalAmountSpent()
      loadUpcomingBookings()
      loadPastBookings()
      loadAvailableRooms('2023/11/30')
    })
    .catch((err) => alert(err)) // need to replace with DOM function
}

// if I do manager iteration -> create a InitializeManagerApp
// this will use `fetchGetAll` and will use DOM fns that load the app for manager

//--------------Event Listeners------------------
window.addEventListener('load', InitializeCustomerApp)

//--------------Event Handlers------------------
const createRandomCustomer = (customerSampleData, bookingSampleData) => {
  const customerIndex = randomizeFromArray(customerSampleData)
  return Customer.fromCustomerData(
    customerSampleData[customerIndex],
    bookingSampleData
  )
}

const createHotel = (roomSampleData, bookingSampleData) => {
  const hotel = Hotel.fromData(roomSampleData, bookingSampleData)
  return hotel
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
    date.innerText = `${formatBookingDisplayDate(upcomingBooking.date)}`

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
  console.log('PAST', pastBookings)

  pastBookings.forEach((booking) => {
    const pastBooking = document.createElement('div')
    const pastDate = document.createElement('p')

    pastBooking.classList.add('pastBooking')
    pastDate.classList.add('pastDate')

    pastBooking.style.backgroundImage = `url(../images/${getRandomImage()})`
    pastDate.innerText = `${formatBookingDisplayDate(booking.date)}`

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
}

const loadAvailableRooms = (selectedDate) => {
  const availabeRooms = store.hotel.showAvailableRooms(selectedDate)
  availabeRooms.forEach((availbleRoom) => {
    const room = document.createElement('div')
    room.dataset.id = `${availbleRoom.number}`
    room.classList.add('available__room')
    room.innerHTML = `<div class="title__container">
    <h2 class="room__title">Room Number</h2>
    <h3 class="room__number">${availbleRoom.number}</h3>
  </div>
  <figure class="room__figure">
    <img class="room__img" src="./images/test-room.jpg" />
  </figure>
  <div class="room__divider"></div>
  <div class="details__container">
    <div class="cost__container">
      <img class="cost__icon" src="./images/dollar.svg" />
      <p class="cost__text">$${availbleRoom.costPerNight} per night</p>
    </div>
    <div class="type__container">
      <img class="type__icon" src="./images/room.svg" />
      <p class="type__text">${availbleRoom.roomType}</p>
    </div>
    <div class="bed__container">
      <img class="bed__icon" src="./images/bed.svg" />
      <p class="bed__text"><span class="bed__amount">${
        availbleRoom.numBeds
      }</span>${availbleRoom.bedSize}</p>
    </div>
    <div class="bidet__container">
      <img class="bidet__icon" src="./images/bidet.svg" />
      <p class="bidet__text">${checkForBidet(availbleRoom)}</p>
    </div>
  </div>
  <div class="room__divider"></div>`

    const bookBtn = document.createElement('btn')
    bookBtn.classList.add('book__btn')
    bookBtn.innerText = 'Book Now'
    bookBtn.dataset.id = `{availableRoom.id}`

    room.appendChild(bookBtn)
    resultsContainer.appendChild(room)
  })
}

const updateNavBtn = () => {
  if (store.currentPage === 'user dashboard') {
    changeElementInnerText(navBtn, 'Dashboard')
    setCurrentPage('reservations')
    toggleHtmlElement(userDashboardSection)
    toggleHtmlElement(reservationsPageSection)
  } else if (store.currentPage === 'reservations') {
    changeElementInnerText(navBtn, 'Make Reservations')
    setCurrentPage('user dashboard')
    toggleHtmlElement(userDashboardSection)
    toggleHtmlElement(reservationsPageSection)
  }
}

const checkForBidet = (room) => {
  if (room.bidet) {
    return 'bidet included'
  } else {
    return 'bidet not included'
  }
}

//--------------Util Functions-------------------
const randomizeFromArray = (array) => {
  return Math.floor(Math.random() * array.length)
}

const getRandomImage = () => {
  return store.bookingImages[randomizeFromArray(store.bookingImages)]
}

const defineEventListeners = () => {
  navBtn.addEventListener('click', updateNavBtn)
}

const toggleHtmlElement = (element) => {
  element.classList.toggle('toggleDisplay')
}

const setCurrentPage = (currentPage) => {
  store.currentPage = currentPage
}

const changeElementInnerText = (element, text) => {
  element.innerText = text
}

const formatForCurrency = (amount) => {
  const formatCurrency = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  })
  return formatCurrency.format(amount)
}

const formatBookingDisplayDate = (bookingDate) => {
  return bookingDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
