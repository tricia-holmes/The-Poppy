//--------------GET Fetch Calls-------------------

const fetchGetData = (url) => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      response.json().then((body) => {
        throw new Error(body.message)
      })
    } else {
      return response.json()
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
  addNewBooking: (customer, bookingDate, roomNumber) => {
    return fetchPostRequest(
      customer,
      bookingDate,
      roomNumber,
      'http://localhost:3001/api/v1/bookings'
    )
  },

  // deleteABooking -> add this when delete fn is created
}

// this fn might need to change compared to a customer vs manager (manager -> get all, customer -> get one)
const fetchGetAll = () => {
  return Promise.all([
    apiCallMap.getAllCustomerData(),
    apiCallMap.getRoomData(),
    apiCallMap.getBookingData(),
  ]).then((data) => {
    // console.log('CUSTOMERS', data[0].customers)
    return {
      customerData: data[0].customers,
      roomData: data[1].rooms,
      bookingData: data[2].bookings,
    }
  })
}

//--------------POST Fetch Calls-------------------

const fetchPostRequest = (customer, bookingDate, roomNumber, url) => {
  const formatBookingDate = formatDateForPost(new Date(bookingDate))
  console.log('POST DATE', formatBookingDate)
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userID: customer.id,
      date: formatBookingDate,
      roomNumber: roomNumber,
    }),
  }).then((response) => {
    if (!response.ok) {
      response.json().then((body) => {
        throw new Error(body.message)
      })
    } else {
      return response.json()
    }
  })
}

const formatDateForPost = (date) => {
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export { fetchGetData, apiCallMap, fetchGetAll }
