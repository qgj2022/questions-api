const fs = require('fs');
const {parse} = require('csv-parse');
const {setUpTablesQuestions} = require('../server/dbQueries.js');
const db = require('./db.js');
const path = require('path');



// const start = async () => {
//   console.log('hello start')
//   await db.connect();
//   console.log('table is set');
// }


const extractQuestions = async() => {
  // PRACTICE WITH SHORT DATA
  // start();
  await setUpTablesQuestions();
  let questions = fs.createReadStream(__dirname + '/REALdata/questions.csv')
    .pipe(parse({columns: true, skip_records_with_error: true}))

  for await(const row of questions) {
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
    console.log(id);
    await db.query(text, values)
      .catch((err) => {
        console.log('err', id);
        console.log(err);
      })
  }
  console.log('finished');
}

extractQuestions();