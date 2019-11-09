const update = require('./update')
const bot = require('./bot')
const schedule = require('node-schedule')

// Init
update()
schedule.scheduleJob('0 0 * * *', update())

// Start
bot.launch()
