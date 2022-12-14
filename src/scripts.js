import { fetchGetAll, createPostRequests, postAll } from './apiCalls'
import Customer from './classes/Customer'
import Hotel from './classes/Hotel'
import Booking from './classes/Booking'

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
import './images/lets-get-away.jpg'
import './images/ornate-hallways-with-chandeliers.jpg'
import './images/ornate-ceiling.jpg'
import './images/beautiful-modern-staircase.jpg'
import './images/moody-antique-hotel-room.jpg'
import './images/dollar.svg'
import './images/room.svg'
import './images/bed.svg'
import './images/bidet.svg'
import './images/crying.png'
import './images/champagne.png'
import './images/poppy.png'
import './images/chandelier.mp4'
import './images/flowers.mp4'
import './images/tablescape.mp4'
import './images/water.mp4'

//--------------Query Selectors------------------
const arrivalDateInput = document.querySelector('#arrivalDate')
const apologyMessage = document.querySelector('[data-id = apologyMessage]')
const bookingModal = document.querySelector('[data-id = bookingModal]')
const bookingModalDetails = document.querySelector(
  '[data-id = bookingModalDetails]'
)
const customerIdDisplay = document.querySelector('[data-id = customerId]')
const customerNameDisplay = document.querySelector('[data-id = customerName]')
const customerToalSpentDisplay = document.querySelector('[data-id = totalCost]')
const departureDateInput = document.querySelector('#departureDate')
const dismissBtn = document.querySelector('.dismiss__btn')
const errorBookingPopUp = document.querySelector(
  '[data-id = errorBookingModal]'
)
const errorDashPopUp = document.querySelector('[data-id = errorDashModal]')
const heroTitle = document.querySelector('[data-id = heroTitle]')
const heroVideo = document.querySelector('.hero__video')
const loginDetails = document.querySelector('.login__details')
const loginErrorMessage = document.querySelector('[data-id=loginError]')
const loginModal = document.querySelector('[data-id = loginModal]')
const navBtn = document.querySelector('[data-id = navbar]')
const passwordLogin = document.querySelector('#password')
const pastBookingsContainer = document.querySelector('[data-id = pastBookings]')
const reservationsPageSection = document.querySelector(
  '[data-page-type = reservations]'
)
const resultsContainer = document.querySelector('[data-id = results]')
const roomTypeInput = document.querySelector('#roomTypes')
const searchBtn = document.querySelector('[data-id = search]')
const searchError = document.querySelector('[data-id = searchError]')
const successBookingPopUp = document.querySelector(
  '[data-id = successBookingModal'
)
const successDismissBtn = document.querySelector(
  '[data-id = successDismissBtn]'
)
const upcomingBookingsContainer = document.querySelector(
  '[data-id = UpcomingBookings]'
)
const userDashboardSection = document.querySelector(
  '[data-page-type = user-dashboard]'
)
const userLogin = document.querySelector('#user')

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
    'lets-get-away.jpg',
    'ornate-hallways-with-chandeliers.jpg',
    'ornate-ceiling.jpg',
    'beautiful-modern-staircase.jpg',
    'moody-antique-hotel-room.jpg',
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
    })
    .catch((err) => {
      showErrorMessage(errorDashPopUp)
      console.error(err)
    })
}

//--------------Make Reservation------------------
const makeReservation = (customer, dateRange, roomNumber) => {
  const requests = createPostRequests(customer, dateRange, roomNumber)
  postAll(requests)
    .then((data) => {
      data.forEach((data) => {
        store.hotel.addBooking(new Booking(data.newBooking), customer)
      })
      loadAvailableRooms()
      loadUpcomingBookings()
      loadTotalAmountSpent()
      showSuccessMessage(successBookingPopUp)
      resetCalendarInputs()
      resetResultsContainer()
    })
    .catch((err) => {
      showErrorMessage(errorBookingPopUp)
      console.error(err)
    })
}

//--------------Query Parameter------------------
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})
const disableLogin = params.disableLogin
const directToReservations = params.directToReservation
if (disableLogin) {
  skipLogin()
} else if (directToReservations) {
  loginSuccess()
  hideLoginModal()
  updateNavBtn()
}

//--------------Event Listeners------------------
window.addEventListener('load', InitializeCustomerApp)

const defineEventListeners = () => {
  arrivalDateInput.addEventListener('input', setArrivalDate)
  bookingModalDetails.addEventListener('click', toggleBookingModal)
  departureDateInput.addEventListener('input', setDepatureDate)
  dismissBtn.addEventListener('click', hideErrorMessage)
  loginDetails.addEventListener('click', loadLogin)
  navBtn.addEventListener('click', updateNavBtn)
  passwordLogin.addEventListener('input', hideloginErrorMessage)
  roomTypeInput.addEventListener('input', resetResultsContainer)
  searchBtn.addEventListener('click', loadAvailableRooms)
  successDismissBtn.addEventListener('click', hideSuccessMessage)
  userLogin.addEventListener('input', hideloginErrorMessage)
}

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
  if (foundUser && checkPassword()) {
    store.customer = foundUser
    loadCustomerProfile()
    loadTotalAmountSpent()
    loadUpcomingBookings()
    loadPastBookings()
    loginSuccess()
    hideLoginModal()
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
    const roomNumber = document.createElement('p')
    const number = document.createElement('span')

    // create function for creating css classes
    booking.tabIndex = 0
    booking.classList.add('booking')
    bookingFigure.classList.add('booking__figure')
    bookingImg.classList.add('booking__img')
    reservation.classList.add('booking__label')
    reservationNumber.classList.add('placeholder')
    bookingDate.classList.add('booking__label')
    date.classList.add('placeholder')
    roomNumber.classList.add('booking__label')
    number.classList.add('placeholder')

    // create function for inputting data
    const randomImg = getRandomImage()
    booking.dataset.id = `${upcomingBooking.id}`
    bookingImg.src = `../images/${randomImg}`
    bookingImg.alt = `${randomImg}`
    reservation.innerText = 'Reservation Number:'
    reservationNumber.innerText = ` ${upcomingBooking.id}`
    bookingDate.innerText = 'Booking Date:'
    date.innerText = `${formatBookingDisplayDate(upcomingBooking.date)}`
    roomNumber.innerText = 'Room Number:'
    number.innerText = `${upcomingBooking.roomNumber}`

    // create function for appending elements
    bookingFigure.appendChild(bookingImg)
    booking.appendChild(bookingFigure)
    reservation.appendChild(reservationNumber)
    booking.appendChild(reservation)
    bookingDate.appendChild(date)
    booking.appendChild(bookingDate)
    roomNumber.appendChild(number)
    booking.appendChild(roomNumber)
    upcomingBookingsContainer.appendChild(booking)
  })
}

const loadPastBookings = () => {
  const pastBookings = store.customer.showPastBookings(store.currentDate)

  pastBookings.forEach((booking) => {
    const pastBooking = document.createElement('div')
    const pastDate = document.createElement('p')

    pastBooking.tabIndex = 0
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

const loadAvailableRooms = () => {
  hideElement(apologyMessage)

  resetResultsContainer()
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
    return displaySearchError(rooms)
  }

  const availableRooms = checkRoomType(roomTypeInput.value, rooms)

  if (availableRooms.length === 0) {
    showElement(apologyMessage)
  } else {
    availableRooms.forEach((availableRoom) => {
      const randomImg = getRandomImage()
      const room = document.createElement('div')
      room.dataset.id = `${availableRoom.number}`
      room.classList.add('available__room')
      room.innerHTML = `<div class="title__container">
      <h2  class="room__title">Room Number</h2>
      <h3 class="room__number">${availableRoom.number}</h3>
    </div>
    <figure class="room__figure">
      <img class="room__img" src="./images/${randomImg}" alt="randomImg" />
    </figure>
    <div class="room__divider"></div>
    <div class="details__container">
      <div class="cost__container">
        <img class="cost__icon" src="./images/dollar.svg" alt="dollarbill icon"/>
        <p  class="cost__text">${formatForCurrency(
          availableRoom.costPerNight
        )} per night</p>
      </div>
      <div class="type__container">
        <img class="type__icon" src="./images/room.svg" alt="icon of a room to represent hotel room type"/>
        <p  class="type__text">${availableRoom.roomType}</p>
      </div>
      <div class="bed__container">
        <img class="bed__icon" src="./images/bed.svg" alt="icon of a bed"/>
        <p  class="bed__text"><span class="bed__amount">${
          availableRoom.numBeds
        }</span>${availableRoom.bedSize}</p>
      </div>
      <div class="bidet__container">
        <img class="bidet__icon" src="./images/bidet.svg" alt="icon of a bidet"/>
        <p  class="bidet__text">${checkForBidet(availableRoom)}</p>
      </div>
    </div>
    <div class="room__divider"></div>`

      const bookBtn = document.createElement('btn')
      bookBtn.classList.add('book__btn')
      bookBtn.innerText = 'Book Now'
      bookBtn.dataset.id = `${availableRoom.number}`
      bookBtn.addEventListener('click', loadBookingModal)
      bookBtn.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          loadBookingModal(e)
        }
      })
      bookBtn.tabIndex = 0
      room.appendChild(bookBtn)
      resultsContainer.appendChild(room)
    })
  }
}

const setArrivalDate = () => {
  hideElement(searchError)
  hideElement(apologyMessage)
  resetResultsContainer()
  departureDateInput.value = arrivalDateInput.value
  const formattedSelectedDate = new Date(
    arrivalDateInput.value.split('-').join('/')
  )
  store.arrivialDate = formattedSelectedDate
  store.departureDate = formattedSelectedDate
}

const setDepatureDate = () => {
  hideElement(searchError)
  hideElement(apologyMessage)
  resetResultsContainer()
  const formattedSelectedDate = new Date(
    departureDateInput.value.split('-').join('/')
  )
  store.departureDate = formattedSelectedDate
}

function updateNavBtn() {
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
  } else if (store.currentPage === 'login') {
    showLoginModal()
  }
}

function loginSuccess() {
  changeElementInnerText(navBtn, 'Make Reservations')
  setCurrentPage('user dashboard')
  toggleHtmlElement(userDashboardSection)
  hideElement(heroTitle)
  heroVideo.src = './images/water.mp4'
}

const checkForBidet = (room) => {
  if (room.bidet) {
    return 'bidet included'
  } else {
    return 'bidet not included'
  }
}

const loadBookingModal = (event) => {
  toggleBookingModal(event)
  findBookingModalDetails(event)
}

const toggleBookingModal = (event) => {
  if (event.target.className === 'book__btn') {
    bookingModal.classList.add('booking__modal-toggle')
  } else if (event.target.className === 'close__btn') {
    bookingModal.classList.remove('booking__modal-toggle')
  }
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
    <img class="cost__icon" src="./images/dollar.svg" alt="dollarbill icon"/>
    <p class="cost__text">$${roomToBook.costPerNight} per night</p>
  </div>
  <div class="type__container">
    <img class="type__icon" src="./images/room.svg" alt="icon of a room to represent hotel room type"/>
    <p  class="type__text">${roomToBook.roomType}</p>
  </div>
  <div class="bed__container">
    <img class="bed__icon" src="./images/bed.svg" alt="icon of a bed"/>
    <p class="bed__text"><span class="bed__amount">${
      roomToBook.numBeds
    }</span>${roomToBook.bedSize}</p>
  </div>
  <div class="bidet__container">
    <img class="bidet__icon" src="./images/bidet.svg" alt="icon of a bidet"/>
    <p class="bidet__text">${checkForBidet(roomToBook)}</p>
  </div>
</div>
<div class="room__divider"></div>
<div class="summary__container">
  <div class="reservations__container">
    <p class="reservations__date">Reservation Dates:</p>
    <p  class="reservations__range">${formatForReservationDate()}</p>
  </div>
  <div class="reservations__container">
    <p  class="reservations__total">Total Cost:</p>
    <p class="reservations__cost">${formatForCurrency(
      roomToBook.costPerNight * store.nightsPerStay
    )}</p>
  </div>
</div>`
  bookingModalDetails.focus()

  const confirmBtn = document.createElement('btn')
  confirmBtn.classList.add('confirm__btn')
  confirmBtn.innerText = 'Book'
  confirmBtn.dataset.id = `${roomToBook.number}`
  confirmBtn.tabIndex = 0
  confirmBtn.addEventListener('click', setupReservation)
  confirmBtn.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      setupReservation(e)
    }
  })

  bookingModalDetails.appendChild(confirmBtn)
}

const checkRoomType = (roomTypeInput, availabelRooms) => {
  if (roomTypeInput === 'optional') {
    return availabelRooms
  } else {
    return store.hotel.filterRoomsByRoomType(roomTypeInput, availabelRooms)
  }
}

const setupReservation = (event) => {
  const roomNumber = Number(event.currentTarget.dataset.id)

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

  while (date.getTime() < endDate.getTime()) {
    store.allDates.push(formatBookingDisplayDate(date))
    date.setDate(date.getDate() + 1)
    store.nightsPerStay++
  }
}

function skipLogin() {
  loginSuccess()
  hideLoginModal()
}

//--------------Util Functions-------------------
const randomizeFromArray = (array) => {
  return Math.floor(Math.random() * array.length)
}

const getRandomImage = () => {
  return store.bookingImages[randomizeFromArray(store.bookingImages)]
}

function setCurrentPage(currentPage) {
  store.currentPage = currentPage
}

function changeElementInnerText(element, text) {
  element.innerText = text
  resetCalendarInputs()
  resetResultsContainer()
  hideElement(searchError)
  hideElement(apologyMessage)
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

function resetCalendarInputs() {
  store.arrivialDate = ''
  store.departureDate = ''
  arrivalDateInput.value = ''
  departureDateInput.value = ''
  roomTypeInput.value = 'optional'
}

function resetResultsContainer() {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
}

//--------------Hide, Show, Toggle Util Functions-------------------
function toggleHtmlElement(element) {
  element.classList.toggle('toggleDisplay')
}

const displaySearchError = (text) => {
  searchError.innerText = text
  showElement(searchError)
}

function hideElement(element) {
  if (!element.classList.contains('hide')) {
    element.classList.add('hide')
  }
}

function showElement(element) {
  if (element.classList.contains('hide')) {
    element.classList.remove('hide')
  }
}

function checkBookingModalClasses() {
  if (bookingModal.classList.contains('booking__modal-toggle')) {
    bookingModal.classList.remove('booking__modal-toggle')
  }
}

function hideErrorMessage() {
  errorBookingPopUp.classList.remove('error__modal-toggle')
}

function showErrorMessage(element) {
  element.classList.add('error__modal-toggle')
  checkBookingModalClasses()
}

function hideSuccessMessage() {
  successBookingPopUp.classList.remove('success__modal-toggle')
}

function showSuccessMessage(element) {
  element.classList.add('success__modal-toggle')
  checkBookingModalClasses()
}

function showLoginModal() {
  loginModal.classList.add('login__modal-toggle')
}

function hideLoginModal() {
  loginModal.classList.remove('login__modal-toggle')
}
