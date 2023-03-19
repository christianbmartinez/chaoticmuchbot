const axios = require('axios')

let pickupLine

async function getPickupLine() {
  try {
    const response = await axios.get('https://pickupline-api.herokuapp.com/')
    pickupLine = response.data.pickup_line
    console.log('Got pickup line data')
  } catch (error) {
    console.error(error)
  }
}
getPickupLine()

module.exports = { getPickupLine }