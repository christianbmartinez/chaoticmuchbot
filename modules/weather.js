const axios = require('axios')
require('dotenv').config()

let degrees

async function getDegrees() {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?zip=90001&appid=${process.env.WEATHER_APP_ID}&units=imperial`
    )
    console.log('Got degrees data')
    degrees = response.data.main.temp
  } catch (error) {
    console.error(error)
  }
}
getDegrees()

let celcius

async function getCelcius() {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?zip=90001&appid=${process.env.WEATHER_APP_ID}&units=metric`
    )
    console.log('Got celcius data')
    celcius = response.data.main.temp
  } catch (error) {
    console.error(error)
  }
}
getCelcius()

module.exports = { getDegrees, getCelcius, degrees, celcius}