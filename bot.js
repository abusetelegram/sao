const Telegraf = require('telegraf')
const dataPath = './data/data.json'
const low = require('lowdb')
const fileAsync = require('lowdb/adapters/FileAsync')
const dataAdapter = new fileAsync(dataPath)
const dataDB = low(dataAdapter)

const bot = new Telegraf(process.env.BOT_TOKEN)
const userId = process.env.TELEGRAM_USER_ID
const botName = process.env.BOT_NAME
// Sticker
const file_id_xq = 'AAQFAAN_AQACRrbHCBwFU3dI7P6X6LEZMwAEAQAHbQAD1gMAAhYE'

const random = () => {
    let arr = dataDB.get('words').value()
    return arr[Math.floor(Math.random() * arr.length)]
}
const randomBoolean = () => Math.random() >= 0.6

const handler = (ctx) => {
  ctx.telegram.sendMessage(ctx.message.chat.id, random(), {
    reply_to_message_id: ctx.message.message_id
  })
}

const addHandler = (ctx) => {
    if (ctx.reply_to_message_id) {
        if (ctx.reply_to_message_id.id === userId) {
            // Matched
            let t = ctx.reply_to_message_id.text.trim()
            dataDB.get('words').push().write()
            ctx.replyWithMarkdown('Added.')
        } else {
            ctx.replyWithMarkdown('User ID mismatch!')
        }
    } else {
        ctx.replyWithMarkdown('Please reply to a message')
    }
}

const inline_handler = (type, text) => {
  return {
    type: 'article',
    description: text.length <= 30 ? text.substring(0, 30) : text.substring(0, 30) + '...',
    id: Date.now() + Date().milliseconds + type,
    title: type,
    message_text: text
  }
}

// Easter EGG
bot.hears(/骚/g, xianqi)
const xianqi = (ctx) => {
  if (randomBoolean()) {
    ctx.telegram.sendSticker(ctx.message.chat.id, file_id_xq, {
      reply_to_message_id: ctx.message.message_id
    })
  }
}

bot.start((ctx) => ctx.reply('这是一只小骚Bot，项目地址：https://github.com/abusetelegram/sao'))
bot.command('sao', handler)
bot.command(`sao@${botName}`, handler)
bot.command(`addsao`, addHandler)
bot.command(`addsao@${botName}`, addhandler)
bot.on('inline_query', (ctx) => {
  ctx.answerInlineQuery([
    inline_handler('就地发骚', random())
  ])
})

module.exports = bot