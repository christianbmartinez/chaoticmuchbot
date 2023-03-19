const axios = require('axios')
require('dotenv').config()

let videoTitle
let videoId

async function getLatestVideo() {
  try {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCgjXO8vYQO1_A-9diNrIsAQ&maxResults=1&order=date&key=${process.env.YOUTUBE_API_KEY}`
    )
    console.log('Got yt video data')
    videoTitle = response.data.items[0].snippet.title
    videoId = response.data.items[0].id.videoId

  } catch (error) {
    console.error(error)
  }
}
getLatestVideo()

module.exports = { getLatestVideo, videoId, videoTitle }