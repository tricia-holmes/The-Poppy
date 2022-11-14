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
const depatureDateInput = document.querySelector('#departureDate')
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
  arrialDate: '',
  depatureDate: '',
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
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  console.log(store.currentDate)
  const availableRooms = store.hotel.showAvailableRooms(
    store.arrialDate,
    store.currentDate,
    store.depatureDate
  )
  console.log('ROOMS', availableRooms)

  if (typeof availableRooms === 'string') {
    alert(availableRooms)
  } else {
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
        <p class="cost__text">$${availableRoom.costPerNight} per night</p>
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
      bookBtn.addEventListener('click', toggleBookingModal)

      room.appendChild(bookBtn)
      resultsContainer.appendChild(room)
    })
  }
}

const setArrivalDate = () => {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  depatureDateInput.value = arrivalDateInput.value
  const formattedSelectedDate = new Date(
    arrivalDateInput.value.split('-').join('/')
  )
  store.arrialDate = formattedSelectedDate
  store.depatureDate = formattedSelectedDate
  console.log('ARRIVE', formattedSelectedDate)
}

const setDepatureDate = () => {
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  const formattedSelectedDate = new Date(
    depatureDateInput.value.split('-').join('/')
  )
  store.depatureDate = formattedSelectedDate
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

const toggleBookingModal = (event) => {
  if (
    event.currentTarget.className === 'book__btn' ||
    event.currentTarget.className === 'close__btn'
  ) {
    bookingModal.classList.toggle('booking__modal-toggle')
  }
  console.log('MODAL', event.currentTarget.dataset.id)
}

const findBookingModalDetails = (event) => {
  bookingModalDetails.innerHTML = ''
  bookingModalDetails.innerHTML = `
  <div class="booking__header">
  <h1 class="booking__logo">THE POPPY</h1>
  <button data-id="closeModalBtn" class="close__btn">&times;</button>
</div>
<div class="room__divider"></div>
<p class="booking__number">
  Room No.<span class="booking__span"> 308</span>
</p>
<div class="room__divider"></div>
<div class="modal__details__container">
  <div class="cost__container">
    <img class="cost__icon" src="./images/dollar.svg" />
    <p class="cost__text">$456.90 per night</p>
  </div>
  <div class="type__container">
    <img class="type__icon" src="./images/room.svg" />
    <p class="type__text">junior suite</p>
  </div>
  <div class="bed__container">
    <img class="bed__icon" src="./images/bed.svg" />
    <p class="bed__text"><span class="bed__amount">3</span>king</p>
  </div>
  <div class="bidet__container">
    <img class="bidet__icon" src="./images/bidet.svg" />
    <p class="bidet__text">bidet included</p>
  </div>
</div>
<div class="room__divider"></div>
<div class="summary__container">
  <div class="reservations__container">
    <p class="reservations__date">Reservation Dates:</p>
    <p class="reservations__range">11/16/2022 - 11/18/2022</p>
  </div>
  <div class="reservations__container">
    <p class="reservations__total">Total Cost:</p>
    <p class="reservations__cost">$478.89</p>
  </div>
</div>
<button class="confirm__btn">Book</button>`
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
  depatureDateInput.addEventListener('input', setDepatureDate)
  searchBtn.addEventListener('click', loadAvailableRooms)
  closeModalBtn.addEventListener('click', toggleBookingModal)
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
