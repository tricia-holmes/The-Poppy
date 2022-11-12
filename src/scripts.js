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
  console.log('HELLO', customerNameDisplay.innerText)
})

window.addEventListener('load', () => {
  loadCustomerProfile()
  console.log('HELLO', customerNameDisplay.innerText)
})
//--------------Event Handlers------------------

const createRandomCustomer = (customerSampleData, bookingSampleData) => {
  const customerIndex = randomizeFromArray(customerSampleData)
  store.customer = Customer.fromCustomerData(
    customerSampleData[customerIndex],
    bookingSampleData
  )
}

const loadCustomerProfile = () => {
  customerNameDisplay.innerText = `${store.customer.name}`
  customerIdDisplay.innerText = `${store.customer.id}`
}

//--------------Util Functions-------------------

const randomizeFromArray = (array) => {
  return Math.floor(Math.random() * array.length)
}
