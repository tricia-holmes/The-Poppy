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

const bookingUrl = 'http://localhost:3001/api/v1/bookings'

const createPostRequests = (customer, dateRange, roomNumber) => {
  const postRequests = []

  dateRange.forEach((date) => {
    const formatBookingDate = formatDateForPost(new Date(date))
    const request = fetch(bookingUrl, {
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
    postRequests.push(request)
  })
  return postRequests
}

function postAll(requests) {
  return Promise.all(requests).then((data) => data)
}

const formatDateForPost = (date) => {
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export { fetchGetData, apiCallMap, fetchGetAll, createPostRequests, postAll }
