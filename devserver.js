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

  if (message.includes('!hello')) {
    chatClient.say(channel, `${tags.username}, hello from chatbot!`)
  }

  console.log(`${tags['display-name']}: ${message}`)
})
