const {Pool} = require('pg');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const db = new Pool({
  host: process.env.DBhost,
  user: process.env.DBuser,
  port: process.env.DBport,
  password: process.env.DBpassword,
  database: process.env.DBdatabase
});

db.connect((err, client, done) => {
  if (err) {
    console.log(err);
  } else {
    console.log('successful pg connection!')
  }
})

module.exports = db;