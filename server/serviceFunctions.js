const { getAllQuestions, getAllAnswers, makeNewQuestion, makeNewAnswer } = require('./dbQueries.js');

const makeResponseGETqanda = async (product_id) => {
  // await startConnection()
  console.log('inside makeResponseGETqanda ln 25')

  async function f() {
    let data = await getAllQuestions(product_id)
    console.log(`data is 28 ${data.rows}`)
    let results = data.rows;
    let length = results.length;
    // let response = [];

    for (let i = 0; i < length; i++) {
      results[i].answers = {};
      let question_id = results[i].questions_id;
      let answerQuery = await getAllAnswers(question_id)

      let answers = answerQuery.rows;
      let lengthAnswers = answers.length;
      for (let j=0; j < lengthAnswers; j++ ) {
        let id = answers[j].id;
        results[i].answers[id] = answers[j];
      }
    }
    console.log(`RESULTS ln 45 ${results}`)
    return results;
  }

  let returnObject = await f();
  return returnObject;
}

const insertInto = (body, type) => {
  if (type === 'question') {
    let text = `INSERT INTO questionsSHORT (product_id, question_body, question_date, asker_name, question_helpfulness, reported, email) VALUES ($1, $2, $3, $4, $5, $6, $7);`
    let values = [
      body.product_id,
      body.body,
      body.date,
      body.name,
      0,
      false,
      body.email
    ];
    return makeNewQuestion(text, values)
  } else {
    let photos = "{";
    body.photos.forEach((photoLink)=>{
      photos += photoLink;
    });
    photos +='}';
    let text = `INSERT INTO answersSHORT (question_id, body, date, answerer_name, helpfulness, reported, answerer_email, photos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
    let values = [
      body.question_id,
      body.body,
      body.date,
      body.name,
      0,
      false,
      body.email,
      photos
    ];
    return makeNewAnswer(text, values);
  }
}

module.exports.insertInto = insertInto;
module.exports.makeResponseGETqanda = makeResponseGETqanda;