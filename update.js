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
    console.log(`Hash set with ${h}`)
}

// Init
module.exports = function () {
    console.log('Reading DB...')
    dataDB.read() // Get latest state
    if (dataDB.get('words').value().length === 0) {
        return gists.get(gid)
            .then(res => {
                dataDB.set('words', JSON.parse(res.body.files[filename].content)).write()
                setHash()
                console.log('Init Database Successfully!')
                return true
            })
            .catch(console.error)
    } else {
        console.log('Update Started')
        let c = dataDB.get('words').value()
        if (hashDB.get('hash').value() !== hash(c)) {
            let update = { files: {} }
            update.files[filename] = {
                content: JSON.stringify(c, null, 2)
            }
            return gists.edit(gid, update).then(res => {
                setHash()
                console.log(`Gist updated at ${hashDB.get('last_update').value()}`)
                return true
            }).catch(console.error)
        } else {
            console.log(`File Unchanged`)
        }
    }
}