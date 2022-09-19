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
  await setUpTablesAnswers();
}


const extractAnswers = async() => {
  // PRACTICE WITH SHORT DATA
  await start();
  let answer = fs.createReadStream(__dirname + '/REALdata/answers.csv')
    .pipe(parse({columns: true, skip_records_with_error: true}))

  for await(const row of answer) {
    let id = parseInt(row.id);
    let date = new Date(parseInt(row.date_written));
    let report = row.reported === '0'? false : true;

    let text = `INSERT INTO answersShort
    (question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
    VALUES ($1, $2, $3, $4, $5, $6, $7);`
    let values = [
      parseInt(row.question_id),
      row.body,
      date,
      row.answerer_name,
      row.answerer_email,
      report,
      parseInt(row.helpful),
    ];
    console.log(id)
    await db.query(text, values)
      .catch((err) => {
        console.log('err', id);
        console.log(err);
      })
  }
  console.log('finished');

}

extractAnswers();

// let id = parseInt(row.id);
// let date = new Date(parseInt(row.date_written));
// let report = row.reported === '0'? false : true;

// //const answer = await      VALUES ($1, $2, $3, $4, $5, $6, $7);`
// let text = `INSERT INTO answersShort
// (question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
// VALUES ($1, $2, $3, $4, $5, $6, $7);`
// let values = [
//   parseInt(row.question_id),
//   row.body,
//   date,
//   row.answerer_name,
//   row.answerer_email,
//   report,
//   parseInt(row.helpful),
// ];
// db.query(text, values)
//   .catch((err) => {
//     console.log('err', id);
//     console.log(err);
//   })

// .on('end', async () => {
//   console.log('finished');
// })