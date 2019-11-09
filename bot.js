const Telegraf = require('telegraf')
const dataPath = './data/data.json'
const low = require('lowdb')
const fileSync = require('lowdb/adapters/FileSync')
const dataAdapter = new fileSync(dataPath)
const dataDB = low(dataAdapter)

const bot = new Telegraf(process.env.BOT_TOKEN)
const userId = parseInt(process.env.TELEGRAM_USER_ID)   
const botName = process.env.BOT_NAME
// Sticker
const file_id_xq = 'CAADBQADfwEAAka2xwgcBVN3SOz-lxYE'

const random = function() {
    let w = dataDB.get('words').sample().value()
    console.log(`Selected: ${w}`)
    return w
}

const randomBoolean = () => Math.random() >= 0.6

const handler = (ctx) => {
  ctx.telegram.sendMessage(ctx.message.chat.id, random(), {
    reply_to_message_id: ctx.message.message_id
  })
}

const addHandler = (ctx) => {
    if (ctx.message.reply_to_message) {
        if (ctx.message.reply_to_message.from && 
            ctx.message.reply_to_message.from.id === userId) {
            // Matched
            let t = ctx.message.reply_to_message.text.trim()
            console.log(`Request add: ${t}`)
            if (dataDB.get('words').indexOf(t).value() === -1) {
                dataDB.get('words').push(t).write()
                ctx.replyWithMarkdown('Added.')
            } else {
                ctx.replyWithMarkdown('Already added.')
            }
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
const xianqi = (ctx) => {
  if (randomBoolean()) {
    ctx.telegram.sendSticker(ctx.message.chat.id, file_id_xq, {
      reply_to_message_id: ctx.message.message_id
    })
  }
}
bot.hears(/骚/g, xianqi)

bot.start((ctx) => ctx.reply('这是一只小骚Bot，项目地址：https://github.com/abusetelegram/sao'))
bot.command('sao', handler)
bot.command(`sao@${botName}`, handler)
bot.command(`addsao`, addHandler)
bot.command(`addsao@${botName}`, addHandler)
bot.on('inline_query', (ctx) => {
  ctx.answerInlineQuery([
    inline_handler('就地发骚', random())
  ])
})

module.exports = bot