const update = require('./update')
const schedule = require('node-schedule')

// Init
schedule.scheduleJob('0 * * * *', update)

// Wait for database init
update().then(res => {
    console.log('Bot Started')
    const bot = require('./bot')
    bot.launch()
})
