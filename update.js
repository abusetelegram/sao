const dataPath = './data/data.json'
const hashPath = './data/hash.json'
const gid = process.env.GIST_ID
const filename = process.env.GIST_FILENAME
const hash = require('object-hash')
const Gists = require('gists')
const low = require('lowdb')
const fileSync = require('lowdb/adapters/FileSync')
const dataAdapter = new fileSync(dataPath)
const hashAdapter = new fileSync(hashPath)
const dataDB = low(dataAdapter)
const hashDB = low(hashAdapter)

const gists = new Gists({
  username: process.env.GITHUB_USERNAME, 
  password: process.env.GITHUB_PASSWORD
})

function setHash() {
    let c = dataDB.get('words').value()
    let h = hash(c)
    let date = Date()
    hashDB.set('hash', h)
        .set('last_update', date)
        .write()
}

// Init
module.exports = function () {
    if (data.length === 0) {
        await gists.get(gid)
            .then(res => {
                dataDB.set('words', res.files[filename].content).write()
                setHash()
                console.log('Init Database Successfully!')
            })
            .catch(console.error)
    } else {
        if (!verifyHash()) {
            // File Updated
            let c = dataDB.get(words).value()
            if (hashDB.get('hash').value() !== hash(c)) {
                update = { file: {} }
                update[filename] = {
                    context: c
                }
                gists.edit(gid, update).then(res => {
                    setHash()
                    console.log(`Gist updated at ${hashDB.get('last_update').value()}`)
                }).catch(console.error)
            }
        }
        console.log('Daily Routine Finished') // I know here is a promise but I am lazy XD
    }
}