const axios = require('axios')
require('dotenv').config()

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
    console.log('Got apex data:', response.data.global.rank.rankName,response.data.global.rank.rankScore, response.data.global.rank.ladderPosPlatform,
    response.data.legends.selected.LegendName, response.data.legends.selected.data[0].value, response.data.legends.selected.gameInfo.skin, 
    response.data.legends.selected.gameInfo.pose, response.data.legends.selected.gameInfo.frame  )
  } catch (error) {
    console.error(error)
  }
}
getApexStats()
setInterval(() => {
  getApexStats()
}, 1000 * 60 )

module.exports = { getApexStats, apexStats : apexStats }