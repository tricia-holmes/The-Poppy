/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchGetData": () => (/* binding */ fetchGetData),
/* harmony export */   "apiCallMap": () => (/* binding */ apiCallMap),
/* harmony export */   "fetchGetAll": () => (/* binding */ fetchGetAll),
/* harmony export */   "createPostRequests": () => (/* binding */ createPostRequests),
/* harmony export */   "postAll": () => (/* binding */ postAll)
/* harmony export */ });
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




/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Booking__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


class Customer {
  constructor(customerData = {}, bookings = []) {
    this.id = customerData.id
    this.name = customerData.name
    this.bookings = bookings
  }

  static fromCustomerData(customerData, bookingData) {
    const matchedBookings = bookingData
      .filter((booking) => booking.userID === customerData.id)
      .map((booking) => new _Booking__WEBPACK_IMPORTED_MODULE_0__.default(booking))

    return new Customer(customerData, matchedBookings)
  }

  showPastBookings(currentDate) {
    return this.bookings
      .filter((booking) => booking.date < currentDate)
      .sort((a, b) => b.date - a.date)
  }

  showUpcomingBookings(currentDate) {
    return this.bookings
      .filter((booking) => booking.date >= currentDate)
      .sort((a, b) => a.date - b.date)
  }

  getTotalCost(hotel) {
    return this.bookings.reduce((total, booking) => {
      hotel.rooms.forEach((hotelRoom) => {
        if (booking.roomNumber === hotelRoom.number) {
          total += hotelRoom.costPerNight
        }
      })
      return total
    }, 0)
  }

  makeBooking(booking) {
    this.bookings.push(booking)
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Customer);


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Booking {
  constructor(bookingInfo = {}) {
    this.id = bookingInfo.id
    this.userID = bookingInfo.userID
    this.date = new Date(bookingInfo.date)
    this.roomNumber = bookingInfo.roomNumber
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Booking);


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Booking__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _Room__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);



class Hotel {
  constructor(rooms = [], bookings = []) {
    this.rooms = rooms
    this.bookings = bookings
  }

  static fromData(roomsData, bookingData) {
    const rooms = roomsData.map((room) => {
      return _Room__WEBPACK_IMPORTED_MODULE_1__.default.fromRoomData(room, bookingData)
    })

    const bookings = bookingData.map((booking) => {
      return new _Booking__WEBPACK_IMPORTED_MODULE_0__.default(booking)
    })

    return new Hotel(rooms, bookings)
  }

  findRoomByNumber(roomNumber) {
    return this.rooms.find(room => room.number === roomNumber)
  }

  filterRoomsByRoomType(type, availabelRooms) {
    return availabelRooms.filter(room => room.roomType === type)
  }

  isValidDate(arrivalDate, currentDate, depatureDate) {
    return (
      depatureDate.getTime() >= arrivalDate.getTime() &&
      arrivalDate.getTime() >= currentDate.getTime()
    )
  }

  showAvailableRooms(arrivalDate, currentDate, depatureDate) {
    if (this.isValidDate(arrivalDate, currentDate, depatureDate)) {
      return this.rooms.filter((room) =>
        room.isAvailable(arrivalDate, depatureDate)
      )
    }

    return 'Sorry that date has already past! Please select another!'
  }

  addBooking(newBooking, customer) {
    const selectedRoom = this.rooms.find((room) => room.number === newBooking.roomNumber)

    selectedRoom.book(newBooking)
    customer.makeBooking(newBooking)
    this.bookings.push(newBooking)
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hotel);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Booking__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


class Room {
  constructor(roomData = {}, bookings = []) {
    this.number = roomData.number
    this.roomType = roomData.roomType
    this.bidet = roomData.bidet
    this.bedSize = roomData.bedSize
    this.numBeds = roomData.numBeds
    this.costPerNight = roomData.costPerNight
    this.bookings = bookings
  }

  static fromRoomData(roomData, bookingData) {
    const matchedBookings = bookingData
      .filter((booking) => booking.roomNumber === roomData.number)
      .map((booking) => new _Booking__WEBPACK_IMPORTED_MODULE_0__.default(booking))

    return new Room(roomData, matchedBookings)
  }

  isAvailable(arrivalDate, depatureDate) {
    const foundBooking = this.bookings.find(
      (booking) =>
        booking.date.getTime() >= arrivalDate.getTime() &&
        booking.date.getTime() <= depatureDate.getTime()
    )

    return !foundBooking
  }

  book(newBooking) {
    this.bookings.push(newBooking)
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Room);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fonts_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fonts_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fonts_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 8 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fonts_CormorantGaramond_Light_ttf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _fonts_CormorantGaramond_Regular_ttf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _fonts_CormorantGaramond_Bold_ttf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(14);
/* harmony import */ var _fonts_CormorantGaramond_SemiBold_ttf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(15);
/* harmony import */ var _fonts_CormorantGaramond_SemiBoldItalic_ttf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(16);
/* harmony import */ var _fonts_CormorantGaramond_MediumItalic_ttf__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(17);
/* harmony import */ var _fonts_Montserrat_VariableFont_wght_ttf__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(18);
// Imports










var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_CormorantGaramond_Light_ttf__WEBPACK_IMPORTED_MODULE_3__.default);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_CormorantGaramond_Regular_ttf__WEBPACK_IMPORTED_MODULE_4__.default);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_CormorantGaramond_Bold_ttf__WEBPACK_IMPORTED_MODULE_5__.default);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_CormorantGaramond_SemiBold_ttf__WEBPACK_IMPORTED_MODULE_6__.default);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_CormorantGaramond_SemiBoldItalic_ttf__WEBPACK_IMPORTED_MODULE_7__.default);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_CormorantGaramond_MediumItalic_ttf__WEBPACK_IMPORTED_MODULE_8__.default);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_fonts_Montserrat_VariableFont_wght_ttf__WEBPACK_IMPORTED_MODULE_9__.default);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@font-face {\n  font-family: \"Cormorant-Light\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"truetype\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"Cormorant-Regular\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"truetype\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"Cormorant-Bold\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"truetype\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"Cormorant-Semi-Bold\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format(\"truetype\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"Cormorant-Semi-Bold-Italic\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format(\"truetype\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"Cormorant-Medium-Italic\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ") format(\"truetype\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"Montserrat\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_6___ + ") format(\"truetype\");\n  font-weight: 400;\n}", "",{"version":3,"sources":["webpack://./src/css/fonts.css"],"names":[],"mappings":"AAAA;EACE,8BAAA;EACA,+DAAA;EACA,gBAAA;AACF;AAEA;EACE,gCAAA;EACA,+DAAA;EACA,gBAAA;AAAF;AAGA;EACE,6BAAA;EACA,+DAAA;EACA,gBAAA;AADF;AAIA;EACE,kCAAA;EACA,+DAAA;EACA,gBAAA;AAFF;AAKA;EACE,yCAAA;EACA,+DAAA;EACA,gBAAA;AAHF;AAMA;EACE,sCAAA;EACA,+DAAA;EACA,gBAAA;AAJF;AAOA;EACE,yBAAA;EACA,+DAAA;EACA,gBAAA;AALF","sourcesContent":["@font-face {\n  font-family: 'Cormorant-Light';\n  src: url('../fonts/CormorantGaramond-Light.ttf') format('truetype');\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: 'Cormorant-Regular';\n  src: url('../fonts/CormorantGaramond-Regular.ttf') format('truetype');\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: 'Cormorant-Bold';\n  src: url('../fonts/CormorantGaramond-Bold.ttf') format('truetype');\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: 'Cormorant-Semi-Bold';\n  src: url('../fonts/CormorantGaramond-SemiBold.ttf') format('truetype');\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: 'Cormorant-Semi-Bold-Italic';\n  src: url('../fonts/CormorantGaramond-SemiBoldItalic.ttf') format('truetype');\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: 'Cormorant-Medium-Italic';\n  src: url('../fonts/CormorantGaramond-MediumItalic.ttf') format('truetype');\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: 'Montserrat';\n  src: url('../fonts/Montserrat-VariableFont_wght.ttf') format('truetype');\n  font-weight: 400;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/CormorantGaramond-Light.ttf");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/CormorantGaramond-Regular.ttf");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/CormorantGaramond-Bold.ttf");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/CormorantGaramond-SemiBold.ttf");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/CormorantGaramond-SemiBoldItalic.ttf");

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/CormorantGaramond-MediumItalic.ttf");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("fonts/Montserrat-VariableFont_wght.ttf");

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 20 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --font-family: \"Cormorant-Regular\", serif;\n}", "",{"version":3,"sources":["webpack://./src/css/variables.css"],"names":[],"mappings":"AAAA;EACE,yCAAA;AACF","sourcesContent":[":root {\n  --font-family: 'Cormorant-Regular', serif;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1___default()), options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1___default().locals) || {});

/***/ }),
/* 22 */
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/css-loader/dist/cjs.js):\nError: Can't resolve './images/chandelier.mp4' in '/Users/holmezi/turing_work/2mod/projects/the_poppy/src/css'\n    at finishWithoutResolve (/Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/Resolver.js:293:18)\n    at /Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/Resolver.js:362:15\n    at /Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/Resolver.js:410:5\n    at eval (eval at create (/Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)\n    at /Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/Resolver.js:410:5\n    at eval (eval at create (/Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:27:1)\n    at /Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/DescriptionFilePlugin.js:87:43\n    at /Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/Resolver.js:410:5\n    at eval (eval at create (/Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)\n    at /Users/holmezi/turing_work/2mod/projects/the_poppy/node_modules/enhanced-resolve/lib/Resolver.js:410:5");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/test-hotel.jpg");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/test-hotel2.jpg");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/test-hotel3.jpg");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/test-hotel4.jpg");

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/test-hotel5.jpg");

/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/test-room.jpg");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/dollar.svg");

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/room.svg");

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/bed.svg");

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/bidet.svg");

/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/crying.png");

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/champagne.png");

/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/chandelier.mp4");

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/pool.mp4");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _classes_Customer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _classes_Hotel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _classes_Booking__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _css_fonts_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _css_variables_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19);
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(21);
/* harmony import */ var _images_test_hotel_jpg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(23);
/* harmony import */ var _images_test_hotel2_jpg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(24);
/* harmony import */ var _images_test_hotel3_jpg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(25);
/* harmony import */ var _images_test_hotel4_jpg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(26);
/* harmony import */ var _images_test_hotel5_jpg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(27);
/* harmony import */ var _images_test_room_jpg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(28);
/* harmony import */ var _images_dollar_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(29);
/* harmony import */ var _images_room_svg__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(30);
/* harmony import */ var _images_bed_svg__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(31);
/* harmony import */ var _images_bidet_svg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(32);
/* harmony import */ var _images_crying_png__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(33);
/* harmony import */ var _images_champagne_png__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(34);
/* harmony import */ var _images_chandelier_mp4__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(35);
/* harmony import */ var _images_pool_mp4__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(36);
// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********





// An example of how you tell webpack to use a CSS (SCSS) file




// An example of how you tell webpack to use an image (also need to link to it in the index.html)















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

//--------------Global Variables------------------
const store = {
  currentPage: 'user dashboard',
  currentDate: new Date(
    `${new Date().getFullYear()}/${
      new Date().getMonth() + 1
    }/${new Date().getDate()}`
  ),
  customer: new _classes_Customer__WEBPACK_IMPORTED_MODULE_1__.default(),
  hotel: new _classes_Hotel__WEBPACK_IMPORTED_MODULE_2__.default(),
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
  ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_0__.fetchGetAll)()
    .then((data) => {
      store.customer = createRandomCustomer(data.customerData, data.bookingData)
      store.hotel = createHotel(data.roomData, data.bookingData)
      defineEventListeners()
      loadCustomerProfile()
      loadTotalAmountSpent()
      loadUpcomingBookings()
      loadPastBookings()
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
  const requests = (0,_apiCalls__WEBPACK_IMPORTED_MODULE_0__.createPostRequests)(customer, dateRange, roomNumber)
  ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_0__.postAll)(requests)
    .then((data) => {
      console.log(data)
      data.forEach((data) => {
        store.hotel.addBooking(new _classes_Booking__WEBPACK_IMPORTED_MODULE_3__.default(data.newBooking), customer)
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

//--------------Event Listeners------------------
window.addEventListener('load', InitializeCustomerApp)
dismissBtn.addEventListener('click', hideErrorMessage)
successDismissBtn.addEventListener('click', hideSuccessMessage)

//--------------Event Handlers------------------
const createRandomCustomer = (customerSampleData, bookingSampleData) => {
  const customerIndex = randomizeFromArray(customerSampleData)
  return _classes_Customer__WEBPACK_IMPORTED_MODULE_1__.default.fromCustomerData(
    customerSampleData[customerIndex],
    bookingSampleData
  )
}

const createHotel = (roomSampleData, bookingSampleData) => {
  const hotel = _classes_Hotel__WEBPACK_IMPORTED_MODULE_2__.default.fromData(roomSampleData, bookingSampleData)
  return hotel
}

const loadUpcomingBookings = () => {
  upcomingBookingsContainer.innerHTML = ``
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
  getDateRange()
  console.log(roomTypeInput.value)
  resultsContainer.innerHTML = `<h1 class="available__title">Available</h1>`
  console.log(store.currentDate)

  if (!store.arrivialDate || !store.currentDate || !store.departureDate) {
    displaySearchError('Please select a date before searching.')
  }

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

const resetCalendarInputs = () => {
  store.arrivialDate = ''
  store.departureDate = ''
  arrivalDateInput.value = ''
  departureDateInput.value = ''
}

const displaySearchError = (text) => {
  searchError.innerText = text
  searchError.classList.remove('hide')
}

const hideSearchError = (text) => {
  searchError.classList.add('hide')
}

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map