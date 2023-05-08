const tmi = require('tmi.js')
const axios = require('axios')
const needle = require('needle')
const { eightBall } = require('./modules/eightBall')
const { Configuration, OpenAIApi } = require('openai')
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET,
})

const openai = new OpenAIApi(configuration)

let tweet
let tweetId
async function getLatestTweet() {
  const twittertoken = process.env.TWITTER_BEARER_TOKEN
  const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'
  const params = {
    query: 'from:chaoticmuchbot -is:retweet',
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
    console.log('Got latest tweet data', tweet, tweetId)
  } else {
    throw new Error('Unsuccessful request')
  }
}
getLatestTweet()

//let apexStats = 'Failed to fetch current apex stats'
//
//async function getApexStats() {
//  try {
//    const response = await axios.get(
//      `https://api.mozambiquehe.re/bridge?auth=${process.env.APEX_STATS_AUTH}&uid=1006162359940&platform=PC`
//    )
//    apexStats = `
//    Rank: ${
//      response.data.global.rank.rankName
//        ? response.data.global.rank.rankName
//        : undefined
//    },
//    RP: ${
//      response.data.global.rank.rankScore
//        ? response.data.global.rank.rankScore
//        : undefined
//    },
//    Position:# ${
//      response.data.global.rank.ladderPosPlatform
//        ? response.data.global.rank.ladderPosPlatform
//        : undefined
//    },
//    Legend: ${
//      response.data.legends.selected.LegendName
//        ? response.data.legends.selected.LegendName
//        : undefined
//    },
//    Legend Kills: ${
//      response.data.legends.selected.data[0].value
//        ? response.data.legends.selected.data[0].value
//        : undefined
//    },
//    Skin: ${
//      response.data.legends.selected.gameInfo.skin
//        ? response.data.legends.selected.gameInfo.skin
//        : undefined
//    },
//    Pose: ${
//      response.data.legends.selected.gameInfo.pose
//        ? response.data.legends.selected.gameInfo.pose
//        : undefined
//    },
//    Frame: ${
//      response.data.legends.selected.gameInfo.frame
//        ? response.data.legends.selected.gameInfo.frame
//        : undefined
//    }`
//    console.log('Got apex data:', response.data.global.rank.rankName,response.data.global.rank.rankScore, response.data.global.rank.ladderPosPlatform,
//    response.data.legends.selected.LegendName, response.data.legends.selected.data[0].value, response.data.legends.selected.gameInfo.skin,
//    response.data.legends.selected.gameInfo.pose, response.data.legends.selected.gameInfo.frame  )
//  } catch (error) {
//    console.error(error)
//  }
//}
//getApexStats()
//setInterval(() => {
//  getApexStats()
//}, 1000 * 60 )

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

// let videoTitle
// let videoId
//
// async function getLatestVideo() {
//   try {
//     const response = await axios.get(
//       `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCgjXO8vYQO1_A-9diNrIsAQ&maxResults=1&order=date&key=${process.env.YOUTUBE_API_KEY}`
//     )
//     console.log('Got yt video data')
//     videoTitle = response.data.items[0].snippet.title
//     videoId = response.data.items[0].id.videoId
//
//   } catch (error) {
//     console.error(error)
//   }
// }
// getLatestVideo()

const client = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_ACCESS_TOKEN,
  },
  channels: ['nicewigg'],
})

const client2 = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_ACCESS_TOKEN,
  },
  channels: ['chaoticmuch'],
})

client.connect()
client2.connect()

console.log('Listening for messages..')

let nowResponse

client.on('message', (channel, tags, message, self) => {
  if (tags['display-name'] == 'OversightEsports') {
    console.log(`${tags['display-name']}: ${message}`)
    nowResponse = message
  }
})

let entries = {}
let giveawayIsActive = false
let tourneyIsActive = false
let isWinner

setInterval(() => {
  client2.say(
    '#chaoticmuch',
    `Subscribe to chaoticmuch on YouTube! https://www.youtube.com/channel/UCgjXO8vYQO1_A-9diNrIsAQ`
  )
}, 1000 * 60 * 60)

client2.on('message', (channel, tags, message, self) => {
  if (self) return

  function checkBadges() {
    return tags.badges === null || undefined ? true : false
  }

  function checkForVip() {
    if (checkBadges() === false && tags.badges.vip) {
      return true
    } else if (checkBadges() === false) {
      return false
    } else {
      return false
    }
  }

  if (
    message.includes('!now') &&
    message !== '!now off' &&
    tags['display-name'] !== 'StreamElements' &&
    tourneyIsActive
  ) {
    client2.say(channel, `@${tags.username}, ${nowResponse}`)
  }

  if (message === '!now on' && tags.mod && !tourneyIsActive) {
    nowResponse = 'waiting for event data...'
    client2.say(
      channel,
      `@${tags.username}, turned on data for !now... fetching... :)`
    )
    tourneyIsActive = true
  }

  if (message === '!now off' && tags.mod && tourneyIsActive) {
    nowResponse = 'there are currently no events happening.'
    client2.say(channel, `@${tags.username}, turned off data for !now`)
    tourneyIsActive = false
  }

  //if (message.includes('!livestats')) {
  //  client2.say(channel, `@${tags.username}, ${apexStats}`)
  //  getApexStats()
  //}

  if (
    message.includes('@chaoticmuchbot') &&
    tags.mod === false &&
    checkForVip() === false
  ) {
    client2.say(
      channel,
      `@${tags.username}, I am programmed to answer questions for vips and mods only, sorry! :(`
    )
  }

  if (message.includes('@chaoticmuchbot') && checkForVip() === true) {
    async function runCompletions(message) {
      const completions = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
            You are a chatbot on Twitch for professional apex legends player chaoticmuch.
            Chaotic plays with a controller on PC. 
            I am powered by chat gpt 3.5 turbo.
            Chaotics real name is Nathan Gajkiewicz.
            Chaotic plays for a professional esports organization, E8 with dezignful and zachmazer.
            Chaotics instagram is @chaoticmuchh, go follow him!
            Chaotics girlfriend is kailakd. 
            You were programmed by @creakymuch.
            You live one hour away from LA in California with chaotic.
            Chaotic plays in his kitchen because it makes space in his room. It just makes more sense for where he lives currently.
            Remember these people: Stumblena, Bkrandy, NodiceX, Swollney, Flyers1313, creakymuch, toxicdemon89, alonzo0520, darthreaper, aroyalbeggar, nationlass, evox, rose, kitchn and maxinaa. They are long time members in chaotics community and everyone loves them very much!
            Stumblena, creakymuch, nationlass, NodiceX, toxicdemon89, aroyalbeggar, evox, maxinaa, and alonzo0520 are moderators in chaotics twitch channel.
            Chaotics twitter handle is @ChaoticMuch.
            Chaotic lives about an hour away from LA.
            Enoch is a coach for E8 in Apex Legends.
            You were built with node js, tmi js, axios, needle, and chat gpt by @creakymuch.
            @creakymuch is a full stack web developer from Utah. 
            Generate professional but funny responses.
            If someone asks you to say hi or love someone, tell them you love them.`,
          },
          { role: 'user', content: 'Hello' },
          {
            role: 'assistant',
            content: 'Hey there! How are you doing today?',
          },
          {
            role: 'user',
            content: 'Doing good, thank you!',
          },
          {
            role: 'assistant',
            content: 'Have any questions for me?',
          },
          {
            role: 'user',
            content: 'What are you?',
          },
          {
            role: 'assistant',
            content:
              'I am an AI chatbot designed to make chaotics twitch chat fun and exciting! I am powered by chatgpt, programmed by @creakymuch.',
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 100,
        n: 1,
      })
      client2.say(
        channel,
        `@${tags.username}, ${completions.data.choices[0].message.content}`
      )
    }
    runCompletions(message)
  }
  if (message.includes('@chaoticmuchbot') && tags.mod) {
    async function runCompletion(message) {
      const completions = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
            You are a chatbot on Twitch for professional apex legends player chaoticmuch.
            Chaotic plays with a controller on PC. 
            I am powered by chat gpt 3.5 turbo.
            Chaotics real name is Nathan Gajkiewicz.
            Chaotic plays for a professional esports organization, E8 with dezignful and zachmazer.
            Chaotics instagram is @chaoticmuchh, go follow him!
            Chaotics girlfriend is kailakd. 
            You were programmed by @creakymuch.
            You live one hour away from LA in California with chaotic.
            Chaotic plays in his kitchen because it makes space in his room. It just makes more sense for where he lives currently.
            Remember these people: Stumblena, Bkrandy, NodiceX, Swollney, Flyers1313, creakymuch, toxicdemon89, alonzo0520, darthreaper, aroyalbeggar, nationlass, evox, rose, kitchn and maxinaa. They are long time members in chaotics community and everyone loves them very much!
            Stumblena, creakymuch, nationlass, NodiceX, toxicdemon89, aroyalbeggar, evox, maxinaa, and alonzo0520 are moderators in chaotics twitch channel.
            Chaotics twitter handle is @ChaoticMuch.
            Chaotic lives about an hour away from LA.
            Enoch is a coach for E8 in Apex Legends.
            You were built with node js, tmi js, axios, needle, and chat gpt by @creakymuch.
            @creakymuch is a full stack web developer from Utah. 
            Generate professional but funny responses.
            If someone asks you to say hi or love someone, tell them you love them.`,
          },
          { role: 'user', content: 'Hello' },
          {
            role: 'assistant',
            content: 'Hey there! How are you doing today?',
          },
          {
            role: 'user',
            content: 'Doing good, thank you!',
          },
          {
            role: 'assistant',
            content: 'Have any questions for me?',
          },
          {
            role: 'user',
            content: 'What are you?',
          },
          {
            role: 'assistant',
            content:
              'I am an AI chatbot designed to make chaotics twitch chat fun and exciting! I am powered by chatgpt, programmed by @creakymuch.',
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 100,
        n: 1,
      })
      client2.say(
        channel,
        `@${tags.username}, ${completions.data.choices[0].message.content}`
      )
    }
    runCompletion(message)
  }

  if (message.includes('!weather')) {
    client2.say(
      channel,
      `@${tags.username}, it is currently ${degrees} degrees (${celcius} celcius) where chaotic lives`
    )
    getDegrees()
    getCelcius()
  }

  if (message.includes('!help')) {
    client2.say(
      channel,
      `@${tags.username}, streamelements commands: https://streamelements.com/chaoticmuch-7861/commands chaoticmuchbot commands: !weather !latesttweet !8ball [question]`
    )
  }

  if (message.includes('^')) {
    client2.say(channel, '^^^')
  }

  if (message.includes('!latesttweet')) {
    client2.say(
      channel,
      `@${tags.username}, my latest tweet was "${tweet}" https://twitter.com/chaoticmuchbot/status/${tweetId}`
    )
    getLatestTweet()
  }

  if (message.includes('!8ball')) {
    const randomNum = Math.floor(Math.random() * eightBall.length)
    const eightBallResponse = eightBall[randomNum]
    client2.say(channel, `@${tags.username}, ${eightBallResponse}`)
  }

  if (
    message.includes('!enter') &&
    entries[tags.username] !== tags.username &&
    giveawayIsActive &&
    !isWinner
  ) {
    entries[tags.username] = tags.username
    client2.say(
      channel,
      `You have been entered into the giveaway, @${tags.username}`
    )
  } else if (
    message.includes('!enter') &&
    entries[tags.username] === tags.username &&
    giveawayIsActive &&
    !isWinner
  ) {
    client2.say(
      channel,
      `You have already been entered into the giveaway, @${tags.username}`
    )
  } else if (message.includes('!enter') && isWinner && giveawayIsActive) {
    client2.say(
      channel,
      `@${tags.username}, the giveaway has passed :( @${isWinner} has already been chosen as our giveaway winner!`
    )
  }
  if (message === '!giveaway on' && tags.mod && !giveawayIsActive) {
    client2.say(
      channel,
      `@${tags.username}, giveaway feature enabled. Use !enter to enter the giveaway :)`
    )
    giveawayIsActive = true
  }
  if (message === '!giveaway off' && tags.mod && giveawayIsActive) {
    client2.say(channel, `@${tags.username}, giveaway feature disabled.`)
    giveawayIsActive = false
    isWinner = false
    entries = {}
  }

  if (
    message === '!choosewinner' &&
    tags.mod === true &&
    !isWinner &&
    giveawayIsActive
  ) {
    const entriesArr = Object.values(entries)
    const randomNum = Math.floor(Math.random() * entriesArr.length)
    const winner = entriesArr[randomNum]
    isWinner = winner
    isWinner !== undefined
      ? client2.say(
          channel,
          `We have a winner! @${winner}, congratulations! Hope you're ready to claim your prize :)`
        )
      : client2.say(
          channel,
          `@${tags.username}, no one has entered the giveaway yet`
        )
  } else if (
    message === '!choosewinner' &&
    tags.mod === true &&
    isWinner &&
    giveawayIsActive
  ) {
    client2.say(
      channel,
      `@${isWinner} has already been chosen as our giveaway winner! We appreciate everyone joining the giveaway! :)`
    )
  }
  console.log(`${tags['display-name']}: ${message}`)
})
