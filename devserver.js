const tmi = require('tmi.js')
const axios = require('axios')
const needle = require('needle')
require('dotenv').config()

const chatClient = new tmi.Client({
  options: {
    debug: true
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_ACCESS_TOKEN,
  },
  channels: ['creakymuch'],
})

let pickupLine

async function getPickupLine() {
  try {
    const response = await axios.get('https://pickupline-api.herokuapp.com/')
    pickupLine = response.data.pickup_line
    console.log('Got a pickup line')
  } catch (error) {
    console.error(error)
  }
}

getPickupLine()

let apexStats = 'Failed to fetch current apex stats'

async function getApexStats() {
  try {
    const response = await axios.get(
      `https://api.mozambiquehe.re/bridge?auth=${process.env.APEX_STATS_AUTH}&uid=1006162359940&platform=PC`
    )
    apexStats = `
    Rank: ${
      response.data.global.rank.rankName
        ? response.data.global.rank.rankName
        : undefined
    }, 
    RP: ${
      response.data.global.rank.rankScore
        ? response.data.global.rank.rankScore
        : undefined
    }, 
    Position:# ${
      response.data.global.rank.ladderPosPlatform
        ? response.data.global.rank.ladderPosPlatform
        : undefined
    }, 
    Legend: ${
      response.data.legends.selected.LegendName
        ? response.data.legends.selected.LegendName
        : undefined
    }, 
    Legend Kills: ${
      response.data.legends.selected.data[0].value
        ? response.data.legends.selected.data[0].value
        : undefined
    }, 
    Skin: ${
      response.data.legends.selected.gameInfo.skin
        ? response.data.legends.selected.gameInfo.skin
        : undefined
    }, 
    Pose: ${
      response.data.legends.selected.gameInfo.pose
        ? response.data.legends.selected.gameInfo.pose
        : undefined
    }, 
    Frame: ${
      response.data.legends.selected.gameInfo.frame
        ? response.data.legends.selected.gameInfo.frame
        : undefined
    }`
    console.log('Got apex stats')
  } catch (error) {
    console.error(error)
  }
}

getApexStats()

setInterval(() => {
  getApexStats()
}, 1000 * 60 )

let tweet
let tweetId

async function getLatestTweet() {
  const twittertoken = process.env.TWITTER_BEARER_TOKEN
  const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'
  const params = {
    query: 'from:chaoticmuch -is:retweet',
    'tweet.fields': 'author_id',
  }
  const res = await needle('get', endpointUrl, params, {
    headers: {
      'User-Agent': 'v2RecentSearchJS',
      authorization: `Bearer ${twittertoken}`,
    },
  })
  if (res.body) {
    tweet = res.body.data[0].text
    tweetId = res.body.data[0].id
    console.log('Got latest tweet')
  } else {
    throw new Error('Unsuccessful request')
  }
}

getLatestTweet()

let degrees

async function getDegrees() {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?zip=92028&appid=${process.env.WEATHER_APP_ID}&units=imperial`
    )
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
      `http://api.openweathermap.org/data/2.5/weather?zip=92028&appid=${process.env.WEATHER_APP_ID}&units=metric`
    )
    celcius = response.data.main.temp
  } catch (error) {
    console.error(error)
  }
}

getCelcius()

//axios.post('https://id.twitch.tv/oauth2/token', {
//    client_id: process.env.TWITCH_BOT_CLIENT_ID,
//    client_secret: process.env.TWITCH_BOT_CLIENT_SECRET,
//    grant_type: 'client_credentials'
//})
//.then(function (response) {
//  accessToken = response.data.access_token
//})
//.catch(error => console.log(error))

//const broadcasterId = '4272608'
//const moderatorId = ''
//
//axios.get('https://api.twitch.tv/helix/search/channels?query=creakymuch', {
//    headers: {
//      'Client-Id': process.env.TWITCH_BOT_CLIENT_ID,
//      'Authorization': 'Bearer ' + process.env.TWITCH_ACCESS_TOKEN,
//}})
//.then(function (response) {
//  console.log(response.data.data[0])
//})
//.catch(error => console.log(error))


//  axios.post('https://api.twitch.tv/helix/chat/announcements', {headers:{
//    'Authorization' : 'Bearer b3x33fjgoar7ozmta9l5avse1c3vqg',
//    'Client-Id': process.env.TWITCH_BOT_CLIENT_ID,
//    'Content-Type': 'application/json'
//  }}).then((data) => console.log(data.data)).catch(err => console.error(err))
//
//sendAnnouncement()
//let accessToken
//let refreshToken

//axios.post('https://id.twitch.tv/oauth2/authorize' +
//'?client_id=' + process.env.TWITCH_BOT_CLIENT_ID + 
//'&redirect_uri=https://localhost' +
//'&response_type=code' +
//'&scope=channel:moderate+chat:edit+chat:read+moderator:manage:announcements+moderator:manage:banned_users+moderator:manage:chat_messages+whispers:read+whispers:edit'
//)
//.then(data => {
//  console.log(data)
//})
//.catch(error => console.error(error))

// GO HERE https://id.twitch.tv/oauth2/authorize?client_id=5vyq1nsaib8c8qgayi0jvulq13wy9y&redirect_uri=https://localhost&response_type=code&scope=channel:moderate+chat:edit+chat:read+moderator:manage:announcements+moderator:manage:banned_users+moderator:manage:chat_messages+whispers:read+whispers:edit
// GET THE CODE FROM URL THEN PASTE BELOW

  axios.post('https://id.twitch.tv/oauth2/token' +
  '?client_id=' + process.env.TWITCH_BOT_CLIENT_ID + 
  '&code=o8z2tq9cpytdug0j73xgt0l829v6dk' +
  '&client_secret=' + process.env.TWITCH_BOT_CLIENT_SECRET + 
  '&grant_type=authorization_code' +
  '&redirect_uri=https://localhost'
  )
  .then(data => {
    console.log(data)
  })
  .catch(error => console.error(error))

const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)

chatClient.connect()

console.log('Listening for messages..')

chatClient.on('message', (channel, tags, message, self) => {

  const commands = {
    pickupline: {
      response: () => {
        getPickupLine()
        return pickupLine
      }
    }, 
    livestats: {
      response: () => {
        getApexStats()
        return apexStats
      }
    },
    latesttweet: {
      response: () => {
        getLatestTweet()
        return `chaotics latest tweet was "${tweet}" https://twitter.com/chaoticmuch/status/${tweetId}`
      }
    }, 
    weather: {
      response: () => {
        getDegrees()
        getCelcius()
        return `it is currently ${degrees} degrees (${celcius} celcius) where chaotic lives`
      }
    }        
  }

  if (self) return

  if (message.match(regExpCommand)) {
    const [raw, command, argument] = message.match(regExpCommand)
    const { response } = commands[command] || {}

  if (typeof response === 'function') {
    chatClient.say(channel, `${tags.username}, ${response()}`)
  } else if (typeof response === 'string') {
    chatClient.say(channel, `${tags.username}, ${response}`)
  }
}

//if (message.includes('hello')) {
//chatClient.say(channel, '/ban @memes')
//}
  
  console.log(`${tags['display-name']}: ${message}`)

})
