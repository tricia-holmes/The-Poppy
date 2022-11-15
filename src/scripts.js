// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import { fetchGetAll, createPostRequests, postAll } from './apiCalls'
import Customer from './classes/Customer'
import Hotel from './classes/Hotel'
import Booking from './classes/Booking'

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
import './images/crying.png'
import './images/champagne.png'
import './images/poppy.png'
import './images/chandelier.mp4'
import './images/pool.mp4'
import './images/flowers.mp4'

//--------------Query Selectors------------------
const customerNameDisplay = document.querySelector('[data-id = customerName]')
const customerIdDisplay = document.querySelector('[data-id = customerId]')
const customerToalSpentDisplay = document.querySelector('[data-id = totalCost]')
const upcomingBookingsContainer = document.querySelector(
  '[data-id = UpcomingBookings]'
)
const pastBookingsContainer = document.querySelector('[data-id = pastBookings]')
const navBtn = document.querySelector('[data-id = navbar]')
const userDashboardSection = document.querySelector(
  '[data-page-type = user-dashboard]'
)
const reservationsPageSection = document.querySelector(
  '[data-page-type = reservations]'
)

const loginPageSection = document.querySelector('[data-page-type = login]')
const loginDetails = document.querySelector('.login__details')
const loginErrorMessage = document.querySelector('[data-id=loginError]')
const userLogin = document.querySelector('#user')
const passwordLogin = document.querySelector('#password')
const closeLoginBtn = document.querySelector('[data-page-type = closeLoginBtn]')
const resultsContainer = document.querySelector('[data-id = results]')
const arrivalDateInput = document.querySelector('#arrivalDate')
const searchError = document.querySelector('[data-id = searchError]')
const searchBtn = document.querySelector('[data-id = search]')
const departureDateInput = document.querySelector('#departureDate')
const roomTypeInput = document.querySelector('#roomTypes')
const bookingModal = document.querySelector('[data-id = bookingModal]')
const bookingModalDetails = document.querySelector(
  '[data-id = bookingModalDetails]'
)

const errorBookingPopUp = document.querySelector(
  '[data-id = errorBookingModal]'
)
const errorDashPopUp = document.querySelector('[data-id = errorDashModal]')
const successBookingPopUp = document.querySelector(
  '[data-id = successBookingModal'
)
const dismissBtn = document.querySelector('.dismiss__btn')
const successDismissBtn = document.querySelector(
  '[data-id = successDismissBtn]'
)

const loginModal = document.querySelector('[data-id = loginModal]')

//--------------Global Variables------------------
const store = {
  currentPage: 'login',
  currentDate: new Date(
    `${new Date().getFullYear()}/${
      new Date().getMonth() + 1
    }/${new Date().getDate()}`
  ),
  customer: new Customer(),
  hotel: new Hotel(),
  bookingImages: [
    'test-hotel.jpg',
    'test-hotel2.jpg',
    'test-hotel3.jpg',
    'test-hotel4.jpg',
    'test-hotel4.jpg',
  ],
  arrivialDate: '',
  departureDate: '',
  allDates: [],
  nightsPerStay: 0,
}

//--------------Initialize Customer App------------------
const InitializeCustomerApp = () => {
  fetchGetAll()
    .then((data) => {
      store.customer = createRandomCustomer(data.customerData, data.bookingData)
      store.hotel = createHotel(
        data.roomData,
        data.bookingData,
        data.customerData
      )
      defineEventListeners()
      loadCustomerProfile()
      loadTotalAmountSpent()
      loadUpcomingBookings()
      loadPastBookings()
      console.log('HOTEL', store.hotel)
    })
    .catch((err) => {
      showErrorMessage(errorDashPopUp)
      console.error(err)
    }) // need to replace with DOM function
}

// if I do manager iteration -> create a InitializeManagerApp
// this will use `fetchGetAll` and will use DOM fns that load the app for manager

//--------------Make Reservation------------------
const makeReservation = (customer, dateRange, roomNumber) => {
  const requests = createPostRequests(customer, dateRange, roomNumber)
  postAll(requests)
    .then((data) => {
      console.log(data)
      data.forEach((data) => {
        store.hotel.addBooking(new Booking(data.newBooking), customer)
        console.log(
          'ROOM',
          store.hotel.findRoomByNumber(data.newBooking.roomNumber)
        )
      })
      loadAvailableRooms()
      loadUpcomingBookings()
      loadTotalAmountSpent()
      showSuccessMessage(successBookingPopUp)
      resetCalendarInputs()
      resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
      console.log('WHAT AM I?', customer.bookings)
    })
    .catch((err) => {
      // toggleHtmlElement(bookingModal)
      showErrorMessage(errorBookingPopUp)
      console.error(err)
    })
}

//--------------Query Parameter------------------
// // Retrieve by query parameter
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})
const disableLogin = params.disableLogin
if (disableLogin) {
  loginSuccess()
  hideLoginModal()
}

//--------------Event Listeners------------------
window.addEventListener('load', InitializeCustomerApp)
dismissBtn.addEventListener('click', hideErrorMessage)
successDismissBtn.addEventListener('click', hideSuccessMessage)
loginDetails.addEventListener('click', loadLogin)
userLogin.addEventListener('input', hideloginErrorMessage)
passwordLogin.addEventListener('input', hideloginErrorMessage)

//--------------Event Handlers------------------
const createRandomCustomer = (customerSampleData, bookingSampleData) => {
  const customerIndex = randomizeFromArray(customerSampleData)
  return Customer.fromCustomerData(
    customerSampleData[customerIndex],
    bookingSampleData
  )
}

const createHotel = (roomData, bookingData, customerData) => {
  const hotel = Hotel.fromData(roomData, bookingData, customerData)
  return hotel
}

function loadLogin(event) {
  if (event.target.className === 'close__btn') {
    hideloginErrorMessage()
    hideLoginModal()
    userLogin.value = ''
    passwordLogin.value = ''
  } else if (event.target.className === 'login__btn') {
    checkLoginCredentials()
  }
}

function checkLoginCredentials() {
  const foundUser = store.hotel.findCustomerByUsername(userLogin.value)
  console.log('FIND', foundUser)
  if (foundUser && checkPassword()) {
    store.customer = foundUser
    loadCustomerProfile()
    loadTotalAmountSpent()
    loadUpcomingBookings()
    loadPastBookings()
    loginSuccess()
    hideLoginModal()
    console.log('woo!')
  } else {
    showLoginErrorMessage()
    setTimeout(() => {
      userLogin.value = ''
      passwordLogin.value = ''
    }, 1000)
  }
}

const checkPassword = () => {
  return passwordLogin.value === 'overlook2021'
}

function showLoginErrorMessage() {
  if (loginErrorMessage.classList.contains('hide')) {
    loginErrorMessage.classList.remove('hide')
  }
}

function hideloginErrorMessage() {
  if (!loginErrorMessage.classList.contains('hide')) {
    loginErrorMessage.classList.add('hide')
  }
}

const loadUpcomingBookings = () => {
  upcomingBookingsContainer.innerHTML = `<h2 class="currentBookings__title">UPCOMING STAYS</h2>`
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
    reservation.tabIndex = 0
    reservationNumber.innerText = ` ${upcomingBooking.id}`
    reservationNumber.tabIndex = 0
    bookingDate.innerText = 'Booking Date:'
    bookingDate.tabIndex = 0
    date.innerText = `${formatBookingDisplayDate(upcomingBooking.date)}`
    date.tabIndex = 0
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
    pastDate.tabIndex = 0

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
  customerToalSpentDisplay.tabIndex = 0
}

const loadAvailableRooms = () => {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  if (!store.arrivialDate || !store.currentDate || !store.departureDate) {
    return displaySearchError('Please select a date before searching.')
  }

  getDateRange()

  const rooms = store.hotel.showAvailableRooms(
    store.arrivialDate,
    store.currentDate,
    store.departureDate
  )

  if (typeof rooms === 'string') {
    displaySearchError(rooms)
  } else {
    const availableRooms = checkRoomType(roomTypeInput.value, rooms)
    console.log('ROOMS', availableRooms)
    availableRooms.forEach((availableRoom) => {
      const room = document.createElement('div')
      room.dataset.id = `${availableRoom.number}`
      room.classList.add('available__room')
      room.innerHTML = `<div class="title__container">
      <h2 class="room__title">Room Number</h2>
      <h3 class="room__number">${availableRoom.number}</h3>
    </div>
    <figure class="room__figure">
      <img class="room__img" src="./images/test-room.jpg" />
    </figure>
    <div class="room__divider"></div>
    <div class="details__container">
      <div class="cost__container">
        <img class="cost__icon" src="./images/dollar.svg" />
        <p class="cost__text">${formatForCurrency(
          availableRoom.costPerNight
        )} per night</p>
      </div>
      <div class="type__container">
        <img class="type__icon" src="./images/room.svg" />
        <p class="type__text">${availableRoom.roomType}</p>
      </div>
      <div class="bed__container">
        <img class="bed__icon" src="./images/bed.svg" />
        <p class="bed__text"><span class="bed__amount">${
          availableRoom.numBeds
        }</span>${availableRoom.bedSize}</p>
      </div>
      <div class="bidet__container">
        <img class="bidet__icon" src="./images/bidet.svg" />
        <p class="bidet__text">${checkForBidet(availableRoom)}</p>
      </div>
    </div>
    <div class="room__divider"></div>`

      const bookBtn = document.createElement('btn')
      bookBtn.classList.add('book__btn')
      bookBtn.innerText = 'Book Now'
      bookBtn.dataset.id = `${availableRoom.number}`
      bookBtn.addEventListener('click', loadBookingModal)

      room.appendChild(bookBtn)
      resultsContainer.appendChild(room)
    })
  }
}

const setArrivalDate = () => {
  if (!searchError.classList.contains('hide')) {
    hideSearchError()
  }

  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  departureDateInput.value = arrivalDateInput.value
  const formattedSelectedDate = new Date(
    arrivalDateInput.value.split('-').join('/')
  )
  store.arrivialDate = formattedSelectedDate
  store.departureDate = formattedSelectedDate
  console.log('ARRIVE', formattedSelectedDate)
}

const setDepatureDate = () => {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  const formattedSelectedDate = new Date(
    departureDateInput.value.split('-').join('/')
  )
  store.departureDate = formattedSelectedDate
  console.log('DEPART', formattedSelectedDate)
}

const updateNavBtn = () => {
  if (store.currentPage === 'user dashboard') {
    changeElementInnerText(navBtn, 'Dashboard')
    setCurrentPage('reservations')
    toggleHtmlElement(userDashboardSection)
    toggleHtmlElement(reservationsPageSection)
    // toggleHtmlElement(loginPageSection)
  } else if (store.currentPage === 'reservations') {
    changeElementInnerText(navBtn, 'Make Reservations')
    setCurrentPage('user dashboard')
    toggleHtmlElement(userDashboardSection)
    toggleHtmlElement(reservationsPageSection)
    // toggleHtmlElement(loginPageSection)
  } else if (store.currentPage === 'login') {
    showLoginModal()
  }
}

function loginSuccess() {
  changeElementInnerText(navBtn, 'user dashboard')
  setCurrentPage('user dashboard')
  toggleHtmlElement(userDashboardSection)
}

const checkForBidet = (room) => {
  if (room.bidet) {
    return 'bidet included'
  } else {
    return 'bidet not included'
  }
}

const loadBookingModal = (event) => {
  console.log('HELLO')
  toggleBookingModal(event)
  findBookingModalDetails(event)
}

const toggleBookingModal = (event) => {
  console.log(event.target.className)
  // findBookingModalDetails(event)

  if (event.target.className === 'book__btn') {
    bookingModal.classList.add('booking__modal-toggle')
  } else if (event.target.className === 'close__btn') {
    bookingModal.classList.remove('booking__modal-toggle')
  }

  console.log('BYE')

  // console.log('MODAL', store.hotel.findRoomByNumber(roomNumber))
}

const findBookingModalDetails = (event) => {
  const roomNumber = Number(event.currentTarget.dataset.id)
  const roomToBook = store.hotel.findRoomByNumber(roomNumber)

  bookingModalDetails.innerHTML = ''
  bookingModalDetails.innerHTML = `
  <div class="booking__header">
  <h1 class="booking__logo">THE POPPY</h1>
  <button data-id="closeModalBtn" class="close__btn">&times;</button>
</div>
<div class="room__divider"></div>
<p class="booking__number">
  Room No.<span class="booking__span"> ${roomToBook.number}</span>
</p>
<div class="room__divider"></div>
<div class="modal__details__container">
  <div class="cost__container">
    <img class="cost__icon" src="./images/dollar.svg" />
    <p class="cost__text">$${roomToBook.costPerNight} per night</p>
  </div>
  <div class="type__container">
    <img class="type__icon" src="./images/room.svg" />
    <p class="type__text">${roomToBook.roomType}</p>
  </div>
  <div class="bed__container">
    <img class="bed__icon" src="./images/bed.svg" />
    <p class="bed__text"><span class="bed__amount">${
      roomToBook.numBeds
    }</span>${roomToBook.bedSize}</p>
  </div>
  <div class="bidet__container">
    <img class="bidet__icon" src="./images/bidet.svg" />
    <p class="bidet__text">${checkForBidet(roomToBook)}</p>
  </div>
</div>
<div class="room__divider"></div>
<div class="summary__container">
  <div class="reservations__container">
    <p class="reservations__date">Reservation Dates:</p>
    <p class="reservations__range">${formatForReservationDate()}</p>
  </div>
  <div class="reservations__container">
    <p class="reservations__total">Total Cost:</p>
    <p class="reservations__cost">${formatForCurrency(
      roomToBook.costPerNight * store.nightsPerStay
    )}</p>
  </div>
</div>`

  const confirmBtn = document.createElement('btn')
  confirmBtn.classList.add('confirm__btn')
  confirmBtn.innerText = 'Book'
  confirmBtn.dataset.id = `${roomToBook.number}`
  confirmBtn.addEventListener('click', setupReservation)

  bookingModalDetails.appendChild(confirmBtn)
}

const checkRoomType = (roomTypeInput, availabelRooms) => {
  if (roomTypeInput === 'optional') {
    return availabelRooms
  } else {
    return store.hotel.filterRoomsByRoomType(roomTypeInput, availabelRooms)
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
  arrivalDateInput.addEventListener('input', setArrivalDate)
  departureDateInput.addEventListener('input', setDepatureDate)
  searchBtn.addEventListener('click', loadAvailableRooms)
  bookingModalDetails.addEventListener('click', toggleBookingModal)
  roomTypeInput.addEventListener('input', resetSearchResults)
}

function hideErrorMessage() {
  // if (event.target.className === 'disMiss_Btn') {
  errorBookingPopUp.classList.remove('error__modal-toggle')
  // toggleHtmlElement(bookingModal)
  // }
}

function showErrorMessage(element) {
  element.classList.add('error__modal-toggle')

  if (bookingModal.classList.contains('booking__modal-toggle')) {
    bookingModal.classList.remove('booking__modal-toggle')
  }
  // toggleHtmlElement(bookingModal)
}

function hideSuccessMessage() {
  // if (event.target.className === 'disMiss_Btn') {
  successBookingPopUp.classList.remove('success__modal-toggle')
  // toggleHtmlElement(bookingModal)
  // }
}

function showSuccessMessage(element) {
  element.classList.add('success__modal-toggle')

  if (bookingModal.classList.contains('booking__modal-toggle')) {
    bookingModal.classList.remove('booking__modal-toggle')
  }
}

function showLoginModal() {
  // if (event.target.className === 'disMiss_Btn') {
  loginModal.classList.add('login__modal-toggle')
  // toggleHtmlElement(bookingModal)
  // }
}

function hideLoginModal() {
  // if (event.target.className === 'disMiss_Btn') {
  loginModal.classList.remove('login__modal-toggle')
  // toggleHtmlElement(bookingModal)
  // }
}

function toggleHtmlElement(element) {
  element.classList.toggle('toggleDisplay')
}

function setCurrentPage(currentPage) {
  store.currentPage = currentPage
}

function changeElementInnerText(element, text) {
  element.innerText = text
  resetCalendarInputs()
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`

  if (!searchError.classList.contains('hide')) {
    hideSearchError()
  }
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

const formatForReservationDate = () => {
  if (
    formatBookingDisplayDate(store.arrivialDate) ===
    formatBookingDisplayDate(store.departureDate)
  ) {
    return formatBookingDisplayDate(store.arrivialDate)
  } else {
    return `${formatBookingDisplayDate(store.arrivialDate)} - 
      ${formatBookingDisplayDate(store.departureDate)}`
  }
}

const resetSearchResults = () => {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
}

const setupReservation = (event) => {
  const roomNumber = Number(event.currentTarget.dataset.id)

  console.log('TELL EM', roomNumber)
  makeReservation(store.customer, store.allDates, roomNumber)
}

const getDateRange = () => {
  store.allDates = []
  store.nightsPerStay = 0

  if (store.arrivialDate === store.departureDate) {
    store.nightsPerStay++
    store.allDates.push(store.arrivialDate)
  }

  const date = new Date(store.arrivialDate)
  const endDate = new Date(store.departureDate)
  // const allDates = []

  while (date.getTime() < endDate.getTime()) {
    store.allDates.push(formatBookingDisplayDate(date))
    date.setDate(date.getDate() + 1)
    store.nightsPerStay++
  }
  console.log(store.allDates)
  console.log(store.nightsPerStay)
}

function resetCalendarInputs() {
  store.arrivialDate = ''
  store.departureDate = ''
  arrivalDateInput.value = ''
  departureDateInput.value = ''
  roomTypeInput.value = 'optional'
}

const displaySearchError = (text) => {
  searchError.innerText = text
  searchError.classList.remove('hide')
}

const hideSearchError = (text) => {
  searchError.classList.add('hide')
}
