const needle = require('needle')
require('dotenv').config()

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
    console.log('Got latest tweet data', tweet, tweetId)
  } else {
    throw new Error('Unsuccessful request')
  }
}

getLatestTweet()

module.exports= { getLatestTweet, tweet, tweetId }