const fs = require('fs');
const {parse} = require('csv-parse');
const {setUpTablesAnswers} = require('../server/db.js');
const {Client} = require('pg');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const db = new Client({
  host: process.env.DBhost,
  user: process.env.DBuser,
  port: process.env.DBport,
  password: process.env.DBpassword,
  database: process.env.DBdatabase
});

const start = async () => {
  console.log('hello start')
  await db.connect();
}


const extractPhotos = async() => {
  // PRACTICE WITH SHORT DATA
  await start();

  let photos = fs.createReadStream(__dirname + '/REALdata/answers_photos.csv')
    .pipe(parse({columns: true, skip_records_with_error: true}))

  for await(const row of photos) {
      let id = parseInt(row.id);

      let text = `UPDATE answersShort set photos = array_prepend($1, photos) WHERE id=$2;`
      let values = [
        `{ ${row.url} }`,
        parseInt(row.answer_id)
      ];

      await db.query(text, values)
      .catch((err) => {
        console.log('err', id);
        console.log(err);
      })
  }
  console.log('finished')
}

extractPhotos();
