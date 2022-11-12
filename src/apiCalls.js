const fetchGetData = (url) => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      response.json().then((body) => {
        alert(body.message) // need to replace with DOM function
        throw new Error(body.message)
      })
    } else {
      console.log('WHAT AM I', response)
      response.json()
    }
  })
}

const apiCallMap = {
  getAllCustomerData: () => {
    return fetchGetData('http://localhost:3001/api/v1/customers')
  },
  getSingleCustomerData: () => {
    return fetchGetData(`http://localhost:3001/api/v1/customers/${customerId}`)
  },
  getRoomData: () => {
    return fetchGetData('http://localhost:3001/api/v1/rooms')
  },
  getBookingData: () => {
    return fetchGetData('http://localhost:3001/api/v1/bookings')
  },
  // addNewBooking -> add this when post fn is created
  // deleteABooking -> add this when delete fn is created
}

// this fn might need to change compared to a customer vs manager (manager -> get all, customer -> get one)
const fetchGetAll = () => {
  return Promise.all([
    apiCallMap.getAllCustomerData(),
    apiCallMap.getRoomData(),
    apiCallMap.getBookingData(),
  ]).then((data) => {
    return {
      customerData: data[0],
      roomData: data[1],
      bookingData: data[2],
    }
  })
}
