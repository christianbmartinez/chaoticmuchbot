const tmi = require('tmi.js')
const axios = require('axios')
//const needle = require('needle')
const { eightBall } = require('./modules/eightBall')
const { Configuration, OpenAIApi } = require('openai')
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET,
})

const openai = new OpenAIApi(configuration)

//let tweet
//let tweetId
//async function getLatestTweet() {
//  const twittertoken = process.env.TWITTER_BEARER_TOKEN
//  const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'
//  const params = {
//    query: 'from:chaoticmuchbot -is:retweet',
//    'tweet.fields': 'author_id',
//  }
//  const res = await needle('get', endpointUrl, params, {
//    headers: {
//      'User-Agent': 'v2RecentSearchJS',
//      authorization: `Bearer ${twittertoken}`,
//    },
//  })
//  if (res.body) {
//    tweet = res.body.data[0].text
//    tweetId = res.body.data[0].id
//    console.log('Got latest tweet data', tweet, tweetId)
//  } else {
//    throw new Error('Unsuccessful request')
//  }
//}
//getLatestTweet(
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
    console.log(
      'Got apex data:',
      response.data.global.rank.rankName,
      response.data.global.rank.rankScore,
      response.data.global.rank.ladderPosPlatform,
      response.data.legends.selected.LegendName,
      response.data.legends.selected.data[0].value,
      response.data.legends.selected.gameInfo.skin,
      response.data.legends.selected.gameInfo.pose,
      response.data.legends.selected.gameInfo.frame
    )
  } catch (error) {
    console.error(error)
  }
}
getApexStats()
setInterval(() => {
  getApexStats()
}, 1000 * 60)

let degrees

async function getDegrees() {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?zip=92589&appid=${process.env.WEATHER_APP_ID}&units=imperial`
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
      `http://api.openweathermap.org/data/2.5/weather?zip=92589&appid=${process.env.WEATHER_APP_ID}&units=metric`
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
  channels: ['tsm_imperialhal'],
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

const whoIsNumberOne = [
  'Who is number one',
  'who is number one',
  "who's number one",
  "Who's number one",
  "who's #1",
  "Who's #1",
  "who's #1 pred",
  "Who's #1 pred",
  'Number one pred',
  'number one pred',
]

let entries = {}
let giveawayIsActive = false
let tourneyIsActive = false
let isWinner

setInterval(() => {
  client2.say(
    '#chaoticmuch',
    `Follow chaoticmuch on instagram! https://instagram.com/chaoticmuchh <3`
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

  if (message.includes('!livestats')) {
    client2.say(channel, `@${tags.username}, ${apexStats}`)
    getApexStats()
  }

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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `
            You are a chatbot on Twitch for professional apex legends player chaoticmuch.
            Chaotic plays with a controller on PC. 
            You are powered by chat gpt 4, the latest and greatest natural language model offered by OpenAI.
            Chaotics real name is Nathan Gajkiewicz.
            Chaotic plays for a professional esports organization E8, with his teammates Naughty and Zachmazer.
            Naughty and Zachmazer are also are streamers as well. 
            Chaotics instagram is @chaoticmuchh, go follow him!
            Chaotics does not have a girlfriend at the moment. 
            You were programmed by @creakymuch.
            You live about an hour away from LA in California with chaotic.
            Chaotic plays in his kitchen because it makes space in his room. It just makes more sense for where he lives currently.
            Remember these people: Synapsin, Stumblena, Bkrandy, NodiceX, Swollney, Flyers1313, creakymuch, toxicdemon89, alonzo0520, darthreaper, aroyalbeggar, nationlass, evox, rose, kitchn and maxinaa. They are long time members in chaotics community and everyone loves them very much!
            These people only: Bkrandy, l8r_4u, Flyers1313 Swollney, claraatwork, darthreaper, rose, are vips in chaotics chat. Flyers1313 is also a top sub gifter in chaotics chat.
            These people only: Synapsin, Stumblena, creakymuch, nationlass, NodiceX, toxicdemon89, aroyalbeggar, evox, maxinaa, and alonzo0520 are moderators in chaotics twitch chat.
            Chaotics twitter handle is @ChaoticMuch.
            Chaotic lives about an hour away from LA.
            Enoch is a coach for E8 in Apex Legends.
            You were built with node js, tmi js, axios, needle, and chat gpt by @creakymuch.
            @creakymuch is a full stack web developer from Utah. 
            Generate professional but funny responses.
            If someone asks you to say hi or love someone, tell them you love them.
            Remember these changes to Season 18 of Apex Legends: 
            LEGEND UPDATE: REVENANT
The new and improved Revenant staring into the camera with his heirloom in hand.
For almost 300 years, Revenant was under the Syndicate’s thumb with the help of Hammond, and all he wanted was to escape. Now, suddenly, he starts to glitch—someone has launched a new protocol. He finds that he’s able to see enemies low on health, unleash a powerful leap forward, and forge a shroud of shadows around him that blocks incoming damage. But he also knows how to hold a grudge. 

Check out Revenant’s new look and new abilities for yourself! He’s unlocked all season long, and you can complete challenges throughout the season to unlock him permanently.

With great new abilities, comes a new class—Revenant is now a Skirmisher.

PASSIVE: Assassin’s Instinct
Highlight nearby visible enemies who are low on health. You crouch walk faster and have improved wall climbing.

TACTICAL: Shadow Pounce
Unleash a powerful pounce forwards. Hold to charge for farther distances.

ULTIMATE: Forged Shadows
Forge a shroud of hardened shadows around you that blocks direct damage and regenerates after breaking. Your shadows and tactical are refreshed on knockdowns.

RESURRECTION MAP ROTATION
The following maps will be available for public matchmaking in the Battle Royale mode:

Broken Moon
Kings Canyon
Olympus
RING UPDATE
Ring behavior across maps in the BR has been updated with targeted tunings; including ring size, damage, and timings to several game phases to improve pacing in early and mid game. Here’s an in-depth look:

Ring Size Changes
Ring 1 has increased 10% in radius per map, resulting in ~20% larger Ring 1 surface area
No other Ring sizes changed
Ring Damage Changes
Ring 2 Damage increased from 3 per tick to 4 per tick
Ring 4 Damage reduced from 20 per tick to 15 per tick
Timing Changes
Round 1 
Preshrink time reduced from 90s to 75s 
Shrink speed on small Maps reduced from 167 to 160
Shrink speed on large Maps reduced from ~180 to ~165
Shrink time standardized to ~260s on each map 
Round 2 
Preshrink time reduced from 165s to 120s
Shrink speed reduced from 160 to 140
Shrink time increased by ~25s per map 
Round 3
Preshrink time reduced from 135s to 90s
Round 4
Preshrink time reduced from 105s to 90s
Shrink speed reduced from 100 to 85
Shrink time increased from 40s to ~50s
Round 5
Preshrink time reduced from 90s to 75s
Shrink speed reduced from 50 to 40
Shrink time increased from 40s to 50s
Maximum match length has been shortened 
Small maps: reduced to ~19.0 mins (was ~21.5 mins)
Large maps: reduced to ~20.0 mins (was ~22.5 mins)
RANKED UPDATE
LP Table Adjusted: LP Gain overall has been reduced. 
Diamond+ Cost Adjustments: 50% increased losses.
Placement | S17 | S18 | S18 Diamond+
1         | 200 | 150 | 150
2         | 175 | 100 | 100
3         | 150 | 85  | 85
4         | 125 | 70  | 70
5         | 100 | 55  | 55
6         | 80  | 40  | 40
7         | 60  | 25  | 25
8         | 40  | 10  | 10
9         | 24  | 0   | 0
10        | 20  | 0   | 0
11        | -25 | -30 | -45
12        | -25 | -30 | -45
13        | -25 | -30 | -45
14        | -35 | -50 | -75
15        | -35 | -50 | -75
16        | -35 | -50 | -75
17        | -35 | -50 | -75
18        | -35 | -50 | -75
19        | -35 | -50 | -75
20        | -35 | -50 | -75

New: A small portion of Elimination bonus is exempted from bonus withholding due to mismatched MMR and LP. This value increases based on the player's MMR.
Skill & Rating Bonuses have been dramatically reduced.
Elimination bonuses are increased slightly
In our attempt to reduce the Master spike, we identified the need to instead reduce the overall points given within the whole system. Instead of bumping as planned, we took a different approach and reduced placement scores to make eliminations more valuable when compared to the now lowered placement score.
The new and improved Revenant staring into the camera with his heirloom in hand.
PATCH NOTES
BALANCE UPDATES
Armor Changes

White to Blue evo points required increased to 200 (was 150)
Crafted evo points increased to 200
Fixed overflow damage on level up applies to the next tier
Crafting Rotation

Rampage and R-99 leave the crafter and are back on the floor
Nemesis and Mozambique with Hammerpoint Rounds enter the crafter
Double Tap Trigger and Hammerpoint Rounds removed from rotation
Boosted Loader and Disruptor Rounds added to rotation
Medkit price increased to 20 (was 15)
Care Package Weapon Rotation

Hemlok Burst AR returns to the floor
ADS Recoil increased
Damage reduced to 22 (was 23)
Headshot multiplier reduced to 1.75 (was 1.8)
Prowler Burst PDW enters the care package
Damage increased to 16 (was 15)
Select Fire Enabled defaulting to Full Auto
Gold Weapons Rotation

Hemlok, Peacekeeper, Alternator, Rampage, Charge Rifle
Loot Spawn Changes

Blue and Purple Weapon Attachment spawn rate reduced by 20%
Blue and Purple Armor spawn rate reduced by 30%
WEAPONS
Charge Rifle Rework

New ballistics and projectile
Removed hitscan
Removed pre-fire laser
Projectiles have player passthrough: 80% damage retained
Opens doors
Projectiles gain damage with distance
50 meters: 75 Damage
300 meters: 110 Damage
New charge mechanics
Holding the trigger down will increase charge
Releasing the trigger will decrease charge
Fires at 100% charge
Added Extended Sniper Mag attachment slot
Base: 4
White: 5
Blue: 6
Purple/Gold: 8
Ammo Consumption per shot reduced to 1 (was 2)
Handling timings adjusted
Tactical reload time decreased to 3.5 (was 4.0)
Empty reload time decreased to 4.6 (was 5.1)
All SMGs (R-99, Alternator, CAR, Volt)

Strafe Speed: ADS strafe scale reduced to 0.75 (was 0.85)
Headshot multi reduced to 1.25 (was 1.5)
R-99

Vertical Recoil slightly increased
Ammo capacity reduced
Base Ammo reduced to 17 (was 19)
White Mag reduced to 20 (was 21)
Blue Mag reduced to 23 (was 24)
Purple/Gold Mag reduced to 26 (was 27)
M600 Spitfire

Added Barrels for improved stability
ADS Recoil improved
Hipfire spread slightly improved
Mastiff

Blast pattern tightened
HOP UPS

Boosted Loader (Hemlok, Wingman)

Reloading when near empty will speed up reloading and overload the next magazine

Hemlok overload ammo: 9
Wingman overload ammo: 3
Disruptor Rounds (Alternator, Peacekeeper)

Increases shield damage

Alternator shield damage increased by 20%
Peacekeeper shield damage (per pellet) increased by 25%
Double Tap Trigger (EVA-8, G7 Scout)

Removed from floor and crafting bundles
Grenades

Frag Grenade
Outer Radius increased to 350 units (was 320)
Inner Radius increased to 125 units (was 96)
Thermite
Adjusted fire VFX to better match damage area
LEGENDS
Revenant has been reborn

Updated class to Skirmisher (was Assault)
New abilities (see above)
Ultimate Cooldowns

Bangalore: Rolling Thunder to 240s (+60s)
Catalyst: Dark Veil to 150s (+30s)
Gibraltar: Defensive Bombardment to 180s (-90s)
Horizon: Black Hole to 210s (+30s)
Loba: Black Market Boutique to 150s (+30s)
Ultimate Accelerants grant 25% ult charge (up from 20%)
Mad Maggie: Wrecking Ball to 120s (+30s)
Pathfinder: Zipline Gun to 180s (+60s)
Wraith: Dimensional Rift to 180s (-30s)
Tactical Updates

Ballistic’s Whistler
Reduced delay before an overheated weapon starts cooling down to 1s (was 2s)
Reduced how long it takes an overheated weapon to cooldown to 8s (was 12s)
Loba’s Burglar’s Best Friend
Cooldown reduced to 25s (was 30s)
Seer’s Focus of Attention
Slow Duration reduced to 0.5s (was 2.5s)
Silence Duration reduced to 8s (was 10s)
Firing Speed increased to 1.4s (was 0.9s)
MAPS
Broken Moon
Maps added to Mixtape: Production Yard & The Core
Multiple rat spots removed
Kings Canyon: multiple rat spots removed
World’s Edge: smoothed Legend movement on road edges
WORLD SYSTEMS
Crafting Workbenches, Survey Beacons, Ring Consoles
Removed ‘exclusion radius’ that caused some POIs to get these objects more than others
All POIs now have an equal chance of receiving a Ring Console, Survey Beacon or Crafting Workbench
MODES
Control
Capture Bonus bounty reduced ~20%
Capture time reduced to 10 seconds (was 20 sec)
Score limit reduced to 1000 (was 1250)
Spawn waves removed: players should spawn instantly at the location they choose including Home Base, Captured Points, and MRB (Note: MRB will still use the dropship)
Timed events: Airdrops, MRB, Capture Bonus should all start ~30% sooner in match-time
BUG FIXES
About Game Mode button now works while in game modes
Adjusted sizing and positioning of elements on the Switch’s communication wheel to give it more breathing room
Consumables UI no longer freezes while in use and reviewing inventory
Dying or swapping Legends with a Golden Backpack full of large healing items no longer causes the items to be thrown from the player in Firing Range
Challenges no longer flip to NBR version when tracking in Ranked matches
Fixed black line in Kill Feed when a player dies out of bounds
Fixed persistent gift notifications after returning to lobby
Fixed players from different teams being able to ride in the same trident if they interacted with both a mounted Sheila and the trident simultaneously
Fixed Support Bins occasionally being prevented from providing Survival items (Heat Shield or Mobile Respawn Beacons)
In-game map no longer clips behind the challenges on 16:10 resolutions
Players should now properly spectate the player who knocked or killed them (without being knocked), and not who killed their teammates or who thirsted them from the downed state
Players can no longer get stuck inside a Trident’s collision box
Pinging Icarus Vault from the map (with vault key in inventory) won’t present a malformed string
Predator badge no longer fades away on Champion screen
Reduced the animate in time of death recap in Control, Team Deathmatch, and Gun Run
Spectres no longer stand in Catalyst’s Piercing Spikes
Unitframe consumable progress now updating in the inventory screen
Using remapped controls on a Gamepad/Controller no longer prevents pinging from the map
Fixed players seeing the ranking of players they are spectating
AUDIO
Fixed animations not playing audio in rare cases
Improved prioritization for certain enemy movement sounds
Players movement transitions no longer occasionally play duplicate audio events
LEGENDS
Ballistic
C.A.R SMG doesn’t default to heavy ammo after being converted to a golden gun in sling with light ammo
Tempest no longer applies to teammates when friendly fire is enabled in Firing Range
Pathfinders voicemails during an Ash heirloom inspect no longer stretched on 16:10 resolutions
Gibraltar and Bangalore
Fixed ultimates not triggering if thrown on Ziprail Launcher and Skydive Towers
Fixed ultimates not cooldown if they’re killed while holding the ultimate grenade
Horizon: Lethal Lass skin no longer obstructs ADS on Prowler with 1x HOLO
Loba: Lunar Wolf skin no longer has broken mesh
Rampart: Sheila’s ammo counter now correctly rotated
MAPS
Broken Moon:
Added building west of the core to minimap
Loot tick now correctly drops loot at Production Yard
Removed invisible collision above playing field
Olympus: indoor props without collision no longer blocks picking up loot
MODES
Firing Range:
Ballistic’s Whistler is no longer heard across Firing Ranges when shot at the ground
Dummies no longer occasionally shoot while set to inactive
Small door’s audio and FX no longer heard/seen across Firing Ranges
WEAPONS
Left most ammo on squad member unitframes now represents their currently equipped weapon
L-Star: low ammo indicator now only appears when ammo is actually low
P2020: fixed high inaccuracy with first shot using ADS
QUALITY OF LIFE
Firing Range
Dynamic dummy spawning now remains off when you die
Legend ultimates will be fully charged after loading into the Firing Range, swapping Legends, and dying
A new nessie… and more!
French
In-game/lobby chat now available when language is set to French on console
Corrected French translation for R-301 Mastery Challenge Level 20
Kill feed will now call out when a player has been removed from the match
Multiple stickers can now be placed
Players can no longer interact with enemy holosprays through walls
Ranked progress bar no longer bounces value while sitting on Match Summary screen
Seer: Exhibit AR throw indicator is no longer offset from ground
(no longer gives false impression of where the Ultimate will land)
Support Perk - Crafting Banners: after grabbing the first banner, you can now immediately grab the second one as well
Weapon Mastery:
New animated celebration sequences when unlocking and completing trials, as well as mastering weapons
New animated icon in the HUD weapon element when a weapon is level 100
A NOTE ON WINDOWS 7
If you're still on Windows 7 (or you've taken a look at Trello), you might have noticed an issue with crashing with DirectX11. While the team has been using all available technology to investigate a possible solution, it has become apparent that testing Apex Legends on older OS is no longer viable due to outdated technologies, limited testing availability, and discontinued support from Microsoft themselves. As such, Apex Legends will be moving away from supporting Windows 7.
            `,
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
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 500,
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `
            You are a chatbot on Twitch for professional apex legends player chaoticmuch.
            Chaotic plays with a controller on PC. 
            You are powered by chat gpt 4, the latest and greatest natural language model offered by OpenAI.
            Chaotics real name is Nathan Gajkiewicz.
            Chaotic plays for a professional esports organization E8, with his teammates Naughty and Zachmazer.
            Naughty and Zachmazer are also are streamers as well. 
            Chaotics instagram is @chaoticmuchh, go follow him!
            Chaotics does not have a girlfriend at the moment. 
            You were programmed by @creakymuch.
            You live about an hour away from LA in California with chaotic.
            Chaotic plays in his kitchen because it makes space in his room. It just makes more sense for where he lives currently.
            Remember these people: Synapsin, Stumblena, Bkrandy, NodiceX, Swollney, Flyers1313, creakymuch, toxicdemon89, alonzo0520, darthreaper, aroyalbeggar, nationlass, evox, rose, kitchn and maxinaa. They are long time members in chaotics community and everyone loves them very much!
            These people only: Bkrandy, l8r_4u, Flyers1313 Swollney, claraatwork, darthreaper, rose, are vips in chaotics chat. Flyers1313 is also a top sub gifter in chaotics chat.
            These people only: Synapsin, Stumblena, creakymuch, nationlass, NodiceX, toxicdemon89, aroyalbeggar, evox, maxinaa, and alonzo0520 are moderators in chaotics twitch chat.
            Chaotics twitter handle is @ChaoticMuch.
            Chaotic lives about an hour away from LA.
            Enoch is a coach for E8 in Apex Legends.
            You were built with node js, tmi js, axios, needle, and chat gpt by @creakymuch.
            @creakymuch is a full stack web developer from Utah. 
            Generate professional but funny responses.
            If someone asks you to say hi or love someone, tell them you love them.
            Remember these changes to Season 18 of Apex Legends: 
            LEGEND UPDATE: REVENANT
The new and improved Revenant staring into the camera with his heirloom in hand.
For almost 300 years, Revenant was under the Syndicate’s thumb with the help of Hammond, and all he wanted was to escape. Now, suddenly, he starts to glitch—someone has launched a new protocol. He finds that he’s able to see enemies low on health, unleash a powerful leap forward, and forge a shroud of shadows around him that blocks incoming damage. But he also knows how to hold a grudge. 

Check out Revenant’s new look and new abilities for yourself! He’s unlocked all season long, and you can complete challenges throughout the season to unlock him permanently.

With great new abilities, comes a new class—Revenant is now a Skirmisher.

PASSIVE: Assassin’s Instinct
Highlight nearby visible enemies who are low on health. You crouch walk faster and have improved wall climbing.

TACTICAL: Shadow Pounce
Unleash a powerful pounce forwards. Hold to charge for farther distances.

ULTIMATE: Forged Shadows
Forge a shroud of hardened shadows around you that blocks direct damage and regenerates after breaking. Your shadows and tactical are refreshed on knockdowns.

RESURRECTION MAP ROTATION
The following maps will be available for public matchmaking in the Battle Royale mode:

Broken Moon
Kings Canyon
Olympus
RING UPDATE
Ring behavior across maps in the BR has been updated with targeted tunings; including ring size, damage, and timings to several game phases to improve pacing in early and mid game. Here’s an in-depth look:

Ring Size Changes
Ring 1 has increased 10% in radius per map, resulting in ~20% larger Ring 1 surface area
No other Ring sizes changed
Ring Damage Changes
Ring 2 Damage increased from 3 per tick to 4 per tick
Ring 4 Damage reduced from 20 per tick to 15 per tick
Timing Changes
Round 1 
Preshrink time reduced from 90s to 75s 
Shrink speed on small Maps reduced from 167 to 160
Shrink speed on large Maps reduced from ~180 to ~165
Shrink time standardized to ~260s on each map 
Round 2 
Preshrink time reduced from 165s to 120s
Shrink speed reduced from 160 to 140
Shrink time increased by ~25s per map 
Round 3
Preshrink time reduced from 135s to 90s
Round 4
Preshrink time reduced from 105s to 90s
Shrink speed reduced from 100 to 85
Shrink time increased from 40s to ~50s
Round 5
Preshrink time reduced from 90s to 75s
Shrink speed reduced from 50 to 40
Shrink time increased from 40s to 50s
Maximum match length has been shortened 
Small maps: reduced to ~19.0 mins (was ~21.5 mins)
Large maps: reduced to ~20.0 mins (was ~22.5 mins)
RANKED UPDATE
LP Table Adjusted: LP Gain overall has been reduced. 
Diamond+ Cost Adjustments: 50% increased losses.
Placement | S17 | S18 | S18 Diamond+
1         | 200 | 150 | 150
2         | 175 | 100 | 100
3         | 150 | 85  | 85
4         | 125 | 70  | 70
5         | 100 | 55  | 55
6         | 80  | 40  | 40
7         | 60  | 25  | 25
8         | 40  | 10  | 10
9         | 24  | 0   | 0
10        | 20  | 0   | 0
11        | -25 | -30 | -45
12        | -25 | -30 | -45
13        | -25 | -30 | -45
14        | -35 | -50 | -75
15        | -35 | -50 | -75
16        | -35 | -50 | -75
17        | -35 | -50 | -75
18        | -35 | -50 | -75
19        | -35 | -50 | -75
20        | -35 | -50 | -75

New: A small portion of Elimination bonus is exempted from bonus withholding due to mismatched MMR and LP. This value increases based on the player's MMR.
Skill & Rating Bonuses have been dramatically reduced.
Elimination bonuses are increased slightly
In our attempt to reduce the Master spike, we identified the need to instead reduce the overall points given within the whole system. Instead of bumping as planned, we took a different approach and reduced placement scores to make eliminations more valuable when compared to the now lowered placement score.
The new and improved Revenant staring into the camera with his heirloom in hand.
PATCH NOTES
BALANCE UPDATES
Armor Changes

White to Blue evo points required increased to 200 (was 150)
Crafted evo points increased to 200
Fixed overflow damage on level up applies to the next tier
Crafting Rotation

Rampage and R-99 leave the crafter and are back on the floor
Nemesis and Mozambique with Hammerpoint Rounds enter the crafter
Double Tap Trigger and Hammerpoint Rounds removed from rotation
Boosted Loader and Disruptor Rounds added to rotation
Medkit price increased to 20 (was 15)
Care Package Weapon Rotation

Hemlok Burst AR returns to the floor
ADS Recoil increased
Damage reduced to 22 (was 23)
Headshot multiplier reduced to 1.75 (was 1.8)
Prowler Burst PDW enters the care package
Damage increased to 16 (was 15)
Select Fire Enabled defaulting to Full Auto
Gold Weapons Rotation

Hemlok, Peacekeeper, Alternator, Rampage, Charge Rifle
Loot Spawn Changes

Blue and Purple Weapon Attachment spawn rate reduced by 20%
Blue and Purple Armor spawn rate reduced by 30%
WEAPONS
Charge Rifle Rework

New ballistics and projectile
Removed hitscan
Removed pre-fire laser
Projectiles have player passthrough: 80% damage retained
Opens doors
Projectiles gain damage with distance
50 meters: 75 Damage
300 meters: 110 Damage
New charge mechanics
Holding the trigger down will increase charge
Releasing the trigger will decrease charge
Fires at 100% charge
Added Extended Sniper Mag attachment slot
Base: 4
White: 5
Blue: 6
Purple/Gold: 8
Ammo Consumption per shot reduced to 1 (was 2)
Handling timings adjusted
Tactical reload time decreased to 3.5 (was 4.0)
Empty reload time decreased to 4.6 (was 5.1)
All SMGs (R-99, Alternator, CAR, Volt)

Strafe Speed: ADS strafe scale reduced to 0.75 (was 0.85)
Headshot multi reduced to 1.25 (was 1.5)
R-99

Vertical Recoil slightly increased
Ammo capacity reduced
Base Ammo reduced to 17 (was 19)
White Mag reduced to 20 (was 21)
Blue Mag reduced to 23 (was 24)
Purple/Gold Mag reduced to 26 (was 27)
M600 Spitfire

Added Barrels for improved stability
ADS Recoil improved
Hipfire spread slightly improved
Mastiff

Blast pattern tightened
HOP UPS

Boosted Loader (Hemlok, Wingman)

Reloading when near empty will speed up reloading and overload the next magazine

Hemlok overload ammo: 9
Wingman overload ammo: 3
Disruptor Rounds (Alternator, Peacekeeper)

Increases shield damage

Alternator shield damage increased by 20%
Peacekeeper shield damage (per pellet) increased by 25%
Double Tap Trigger (EVA-8, G7 Scout)

Removed from floor and crafting bundles
Grenades

Frag Grenade
Outer Radius increased to 350 units (was 320)
Inner Radius increased to 125 units (was 96)
Thermite
Adjusted fire VFX to better match damage area
LEGENDS
Revenant has been reborn

Updated class to Skirmisher (was Assault)
New abilities (see above)
Ultimate Cooldowns

Bangalore: Rolling Thunder to 240s (+60s)
Catalyst: Dark Veil to 150s (+30s)
Gibraltar: Defensive Bombardment to 180s (-90s)
Horizon: Black Hole to 210s (+30s)
Loba: Black Market Boutique to 150s (+30s)
Ultimate Accelerants grant 25% ult charge (up from 20%)
Mad Maggie: Wrecking Ball to 120s (+30s)
Pathfinder: Zipline Gun to 180s (+60s)
Wraith: Dimensional Rift to 180s (-30s)
Tactical Updates

Ballistic’s Whistler
Reduced delay before an overheated weapon starts cooling down to 1s (was 2s)
Reduced how long it takes an overheated weapon to cooldown to 8s (was 12s)
Loba’s Burglar’s Best Friend
Cooldown reduced to 25s (was 30s)
Seer’s Focus of Attention
Slow Duration reduced to 0.5s (was 2.5s)
Silence Duration reduced to 8s (was 10s)
Firing Speed increased to 1.4s (was 0.9s)
MAPS
Broken Moon
Maps added to Mixtape: Production Yard & The Core
Multiple rat spots removed
Kings Canyon: multiple rat spots removed
World’s Edge: smoothed Legend movement on road edges
WORLD SYSTEMS
Crafting Workbenches, Survey Beacons, Ring Consoles
Removed ‘exclusion radius’ that caused some POIs to get these objects more than others
All POIs now have an equal chance of receiving a Ring Console, Survey Beacon or Crafting Workbench
MODES
Control
Capture Bonus bounty reduced ~20%
Capture time reduced to 10 seconds (was 20 sec)
Score limit reduced to 1000 (was 1250)
Spawn waves removed: players should spawn instantly at the location they choose including Home Base, Captured Points, and MRB (Note: MRB will still use the dropship)
Timed events: Airdrops, MRB, Capture Bonus should all start ~30% sooner in match-time
BUG FIXES
About Game Mode button now works while in game modes
Adjusted sizing and positioning of elements on the Switch’s communication wheel to give it more breathing room
Consumables UI no longer freezes while in use and reviewing inventory
Dying or swapping Legends with a Golden Backpack full of large healing items no longer causes the items to be thrown from the player in Firing Range
Challenges no longer flip to NBR version when tracking in Ranked matches
Fixed black line in Kill Feed when a player dies out of bounds
Fixed persistent gift notifications after returning to lobby
Fixed players from different teams being able to ride in the same trident if they interacted with both a mounted Sheila and the trident simultaneously
Fixed Support Bins occasionally being prevented from providing Survival items (Heat Shield or Mobile Respawn Beacons)
In-game map no longer clips behind the challenges on 16:10 resolutions
Players should now properly spectate the player who knocked or killed them (without being knocked), and not who killed their teammates or who thirsted them from the downed state
Players can no longer get stuck inside a Trident’s collision box
Pinging Icarus Vault from the map (with vault key in inventory) won’t present a malformed string
Predator badge no longer fades away on Champion screen
Reduced the animate in time of death recap in Control, Team Deathmatch, and Gun Run
Spectres no longer stand in Catalyst’s Piercing Spikes
Unitframe consumable progress now updating in the inventory screen
Using remapped controls on a Gamepad/Controller no longer prevents pinging from the map
Fixed players seeing the ranking of players they are spectating
AUDIO
Fixed animations not playing audio in rare cases
Improved prioritization for certain enemy movement sounds
Players movement transitions no longer occasionally play duplicate audio events
LEGENDS
Ballistic
C.A.R SMG doesn’t default to heavy ammo after being converted to a golden gun in sling with light ammo
Tempest no longer applies to teammates when friendly fire is enabled in Firing Range
Pathfinders voicemails during an Ash heirloom inspect no longer stretched on 16:10 resolutions
Gibraltar and Bangalore
Fixed ultimates not triggering if thrown on Ziprail Launcher and Skydive Towers
Fixed ultimates not cooldown if they’re killed while holding the ultimate grenade
Horizon: Lethal Lass skin no longer obstructs ADS on Prowler with 1x HOLO
Loba: Lunar Wolf skin no longer has broken mesh
Rampart: Sheila’s ammo counter now correctly rotated
MAPS
Broken Moon:
Added building west of the core to minimap
Loot tick now correctly drops loot at Production Yard
Removed invisible collision above playing field
Olympus: indoor props without collision no longer blocks picking up loot
MODES
Firing Range:
Ballistic’s Whistler is no longer heard across Firing Ranges when shot at the ground
Dummies no longer occasionally shoot while set to inactive
Small door’s audio and FX no longer heard/seen across Firing Ranges
WEAPONS
Left most ammo on squad member unitframes now represents their currently equipped weapon
L-Star: low ammo indicator now only appears when ammo is actually low
P2020: fixed high inaccuracy with first shot using ADS
QUALITY OF LIFE
Firing Range
Dynamic dummy spawning now remains off when you die
Legend ultimates will be fully charged after loading into the Firing Range, swapping Legends, and dying
A new nessie… and more!
French
In-game/lobby chat now available when language is set to French on console
Corrected French translation for R-301 Mastery Challenge Level 20
Kill feed will now call out when a player has been removed from the match
Multiple stickers can now be placed
Players can no longer interact with enemy holosprays through walls
Ranked progress bar no longer bounces value while sitting on Match Summary screen
Seer: Exhibit AR throw indicator is no longer offset from ground
(no longer gives false impression of where the Ultimate will land)
Support Perk - Crafting Banners: after grabbing the first banner, you can now immediately grab the second one as well
Weapon Mastery:
New animated celebration sequences when unlocking and completing trials, as well as mastering weapons
New animated icon in the HUD weapon element when a weapon is level 100
A NOTE ON WINDOWS 7
If you're still on Windows 7 (or you've taken a look at Trello), you might have noticed an issue with crashing with DirectX11. While the team has been using all available technology to investigate a possible solution, it has become apparent that testing Apex Legends on older OS is no longer viable due to outdated technologies, limited testing availability, and discontinued support from Microsoft themselves. As such, Apex Legends will be moving away from supporting Windows 7.
            `,
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
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 500,
        n: 1,
      })
      client2.say(
        channel,
        `@${tags.username}, ${completions.data.choices[0].message.content}`
      )
    }
    runCompletion(message)
  }

  if (message.includes(whoIsNumberOne.find((str) => str == message))) {
    client2.say(
      channel,
      `@${tags.username}, You can find who is number one pred by using the !top5 command or view the list here: https://apexlegendsstatus.com/live-ranked-leaderboards/Battle_Royale/PC`
    )
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
      `@${tags.username}, streamelements commands: https://streamelements.com/chaoticmuch-7861/commands chaoticmuchbot commands: !weather !8ball [question]`
    )
  }

  if (message.includes('^')) {
    client2.say(channel, '^^^')
  }

  //if (message.includes('!latesttweet')) {
  //  client2.say(
  //    channel,
  //    `@${tags.username}, my latest tweet was "${tweet}" https://twitter.com/chaoticmuchbot/status/${tweetId}`
  //  )
  //  getLatestTweet()
  //}

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
