const tmi = require('tmi.js')
require('dotenv').config()

const chatClient = new tmi.Client({
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_ACCESS_TOKEN,
  },
  channels: ['creakymuch'],
})

chatClient.connect()

console.log('Listening for messages..')

chatClient.on('message', (channel, tags, message, self) => {
  if (self) return
  if (message.includes('!test')) {
    chatClient.say(channel, 'This is a test.')
    chatClient.ban(channel, tags['display-name'], 'Banned by chatbot' )
  }

  console.log(`${tags['display-name']}: ${message}`)
})
