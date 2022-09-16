const fs = require('fs');
const {parse} = require('csv-parse');
const {setUpTablesQuestions} = require('../server/db.js');
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
  await setUpTablesQuestions();
}


const extractQuestions = async() => {
  // PRACTICE WITH SHORT DATA
  await start();
  fs.createReadStream(__dirname + '/SHORTdata/questionsShort.csv')
    .pipe(parse({columns: true, relax_quotes: true, skip_records_with_error: true}))
    .on('data', (row) => {
      let id = parseInt(row.id);
      let date = new Date(parseInt(row.date_written));
      let report = row.reported === '0'? false : true;
      //const question = await      VALUES ($1, $2, $3, $4, $5, $6, $7);`
      let text = `INSERT INTO questionsShort
      (product_id, question_body, question_date, asker_name, question_helpfulness, reported, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7);`
      let values = [
        parseInt(row.product_id),
        row.body,
        date,
        row.asker_name,
        parseInt(row.helpful),
        report,
        row.asker_email
      ];
      db.query(text, values)
        .catch((err) => {
          console.log('err', id);
          console.log(err);
        })

    })
    .on('end', async () => {
      console.log('finished');
    })
}

extractQuestions();