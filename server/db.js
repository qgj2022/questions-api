const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  user: process.env.DBuser,
  host: process.env.DBhost,
  database: process.env.DBdatabase,
  password: process.env.DBpassword,
  port: process.env.DBport,
});

// max: 10000,
// idleTimeoutMillis: 3000,
// connectionTimeoutMillis: 20000,
// db.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err)
//   process.exit(-1)
// })

db.connect((err, client, done) => {
  if (err) {
    console.log(err);
  } else {
    console.log('successful pg connection!')
  }
})

module.exports = db;