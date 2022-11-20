const tmi = require('tmi.js')
require('dotenv').config()
const axios = require('axios')
const needle = require('needle')
const {evaluate} = require('decimal-eval')
const twittertoken = process.env.TWITTER_BEARER_TOKEN
const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'
let tweet
let tweetId

async function getLatestTweet() {
  const params = {
    query: 'from:g2chaotic -is:retweet',
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
    console.log('Got latest tweet data')
  } else {
    throw new Error('Unsuccessful request')
  }
}

(async () => {
  try {
    const resp = await getLatestTweet()
  } catch (e) {
    console.log(e)
  }
})()


let apexStats = 'Failed to fetch current apex stats'

async function getApexStats() {
  try {
    const response = await axios.get(
      `https://api.mozambiquehe.re/bridge?auth=${process.env.APEX_STATS_AUTH}&uid=1006162359940&platform=PC`
    )
    apexStats = `
    Rank: ${response.data.global.rank.rankName}, 
    RP: ${response.data.global.rank.rankScore}, 
    Position:# ${response.data.global.rank.ladderPosPlatform}, 
    Legend: ${response.data.legends.selected.LegendName}, 
    Legend Kills: ${response.data.legends.selected.data[0].value}, 
    Skin: ${response.data.legends.selected.gameInfo.skin}, 
    Pose: ${response.data.legends.selected.gameInfo.pose}, 
    Frame: ${response.data.legends.selected.gameInfo.frame}`
    console.log('Got apex data')
  } catch (error) {
    console.error(error)
  }
}
getApexStats()

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

const client = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_ACCESS_TOKEN,
  },
  channels: ['TSM_ImperialHal'],
})

const client2 = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_ACCESS_TOKEN,
  },
  channels: ['chaoticmuchbot'],
})

client.connect()
client2.connect()

console.log('Listening for messages..')

let nowResponse = 'there are currently no events happening.'
client.on('message', (channel, tags, message, self) => {
  if (tags['display-name'] == 'OversightEsports') {
    console.log(`${tags['display-name']}: ${message}`)
    nowResponse = message
  }
})

let arr = [
  '@chaoticmuchbot do you like me',
  '@chaoticmuchbot do you love me',
  '@chaoticmuchbot do you hate me'
]

function isMathProblem(str) {
  return /^(\d*\.?\d*)\s?[-+/*]\s?(\d*\.?\d*)$/g.test(str)
}

let math

function performMath(str) {
  math = evaluate(str)
}

const entries = {}
const giveawayIsActive = false

let isWinner

client2.on('message', (channel, tags, message, self) => {
  if (self) return
  if (message.includes('!now')) {
    client2.say(channel, `@${tags.username}, ${nowResponse}`)
  }
  if (message.includes('!livestats')) {
    client2.say(channel, `@${tags.username}, ${apexStats}`)
    getApexStats()
  }
  if (message.includes('!weather')) {
    client2.say(
      channel,
      `@${tags.username}, it is currently ${degrees} degrees (${celcius} celcius) in Los Angeles for chaotic.`
    )
    getDegrees()
    getCelcius()
  }
  if (message.includes('!help')) {
    client2.say(
      channel,
      `@${tags.username}, streamelements commands: https://streamelements.com/chaoticmuch-7861/commands chaoticmuchbot commands: !now !livestats !weather !latesttweet`
    )
  }
  if (message.includes('^')) {
    client2.say(channel, '^^^')
  }
  if (message.includes(arr.find((element) => element === message))) {
    client2.say(channel, `@${tags.username}, Not really Kappa`)
  }
  if (isMathProblem(message)) {
    performMath(message)
    client2.say(channel, `@${tags.username}, The answer is ${math}`)
  }
  if (giveawayIsActive === true) {
    if (
      message.includes('!enter') &&
      entries[tags.username] !== tags.username
    ) {
      entries[tags.username] = tags.username
      client.say(
        channel,
        `You have been entered into the giveaway, @${tags.username}`
      )
    } else if (
      message.includes('!enter') &&
      entries[tags.username] === tags.username
    ) {
      client.say(
        channel,
        `You have already been entered into the giveaway, @${tags.username}`
      )
    }
    if (message === '!choosewinner' && tags.mod === true && !isWinner) {
      const entriesArr = Object.values(entries)
      const randomNum = Math.floor(Math.random() * entriesArr.length)
      const winner = entriesArr[randomNum]
      isWinner = winner
      client.say(
        channel,
        `We have a winner! @${winner}, congratulations! Hope you're ready to claim your prize :)`
      )
    } else if (message === '!choosewinner' && tags.mod === true && isWinner) {
      client.say(
        channel,
        `@${isWinner} has already been chosen as our giveaway winner! We appreciate everyone joining the giveaway! :)`
      )
    }
  }
  if (message.includes('!latesttweet')) {
    client.say(
      channel,
      `@${tags.username}, chaotics latest tweet was "${tweet}" https://twitter.com/G2Chaotic/status/${tweetId}`
    )
    getLatestTweet()
  }
  console.log(`${tags['display-name']}: ${message}`)
})
