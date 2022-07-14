var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "server/database.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        db.run(`SELECT name FROM sqlite_master WHERE type = 'table';`,
        (err) => {
            if (err) {
                console.log('Database (database.db) not found.')
            }
        });  
    }
});


module.exports = db