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
const pastBookingsContainer = document.querySelector('[data-id = pastBookings]')
const navBtn = document.querySelector('[data-id = navbar]')
const userDashboardSection = document.querySelector(
  '[data-page-type = user-dashboard]'
)
const reservationsPageSection = document.querySelector(
  '[data-page-type = reservations]'
)
const resultsContainer = document.querySelector('[data-id = results]')
const arrivalDateInput = document.querySelector('#arrivalDate')
const searchBtn = document.querySelector('[data-id = search]')
const departureDateInput = document.querySelector('#departureDate')
const roomTypeInput = document.querySelector('#roomTypes')
const bookingModal = document.querySelector('[data-id = bookingModal]')
const closeModalBtn = document.querySelector('[data-id = closeModalBtn]')
const bookingModalDetails = document.querySelector(
  '[data-id = bookingModalDetails]'
)

//--------------Global Variables------------------
const store = {
  currentPage: 'user dashboard',
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
  arrvialDate: '',
  departureDate: '',
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
    })
    .catch((err) => console.error(err)) // need to replace with DOM function
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

const loadAvailableRooms = () => {
  console.log(roomTypeInput.value)
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  console.log(store.currentDate)

  if (!store.arrvialDate || !store.currentDate || !store.departureDate) {
    return alert('not defined!')
  }

  const rooms = store.hotel.showAvailableRooms(
    store.arrvialDate,
    store.currentDate,
    store.departureDate
  )

  
  if (typeof rooms === 'string') {
    alert(rooms)
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
        <p class="cost__text">${formatForCurrency(availableRoom.costPerNight)} per night</p>
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
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  departureDateInput.value = arrivalDateInput.value
  const formattedSelectedDate = new Date(
    arrivalDateInput.value.split('-').join('/')
  )
  store.arrvialDate = formattedSelectedDate
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

const loadBookingModal = (event) => {
  toggleBookingModal(event)
  findBookingModalDetails(event)
}

const toggleBookingModal = (event) => {
  console.log(event.currentTarget.className)
  findBookingModalDetails(event)

  if (
    event.currentTarget.className === 'book__btn' ||
    event.currentTarget.className === 'confirm__btn'
  ) {
    bookingModal.classList.toggle('booking__modal-toggle')
  }

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
    <p class="reservations__cost">${formatForCurrency(roomToBook.costPerNight)}</p>
  </div>
</div>`

  const confirmBtn = document.createElement('btn')
  confirmBtn.classList.add('confirm__btn')
  confirmBtn.innerText = 'Book'
  confirmBtn.dataset.id = `${roomToBook.number}`
  confirmBtn.addEventListener('click', toggleBookingModal)

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
  closeModalBtn.addEventListener('click', toggleBookingModal)
  roomTypeInput.addEventListener('input', resetSearchResults)
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

const formatForReservationDate = () => {
  if (
    formatBookingDisplayDate(store.arrvialDate) ===
    formatBookingDisplayDate(store.departureDate)
  ) {
    return formatBookingDisplayDate(store.arrvialDate)
  } else {
    return `${formatBookingDisplayDate(store.arrvialDate)} - 
      ${formatBookingDisplayDate(store.departureDate)}`
  }
}

const resetSearchResults = () => {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
}
