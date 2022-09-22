const db = require('./db.js')

const setUpTablesQuestions = async () => {

  await db.query(`DROP TABLE IF EXISTS questionsSHORT;`);

  await db.query(`CREATE TABLE questionsSHORT(
    questions_id serial NOT NULL,
    product_id int NOT NULL,
    question_body character varying (1000) NOT NULL,
    question_date text NOT NULL,
    asker_name character varying (60) NOT NULL,
    question_helpfulness integer NOT NULL,
    reported boolean NOT NULL,
    email character varying (60) NOT NULL,
    PRIMARY KEY (questions_id)
    );`
  );
}

const setUpTablesAnswers = async () => {

  await db.query(`DROP TABLE IF EXISTS answersSHORT;`);

  await db.query(`CREATE TABLE answersSHORT(
    id serial NOT NULL,
    question_id int NOT NULL,
    body character varying (1000) NOT NULL,
    date text NOT NULL,
    answerer_name character varying (60) NOT NULL,
    answerer_email character varying (60) NOT NULL,
    reported boolean NOT NULL,
    helpfulness integer NOT NULL,
    photos text[],
    PRIMARY KEY (id)
    );`
  );
}

const setUpINDEX = async () => {
  await db.query(`CREATE INDEX product_id ON questionsSHORT (product_id);`);
  await db.query(`CREATE INDEX questions_id ON answersSHORT`);
}

const getAllQuestions = (product_id) => {
  return db.query(`SELECT questions_id, question_body, question_date, asker_name, question_helpfulness, reported FROM questionsSHORT WHERE product_id=${product_id} AND reported=false`)
}

const getAllAnswers = (question_id) => {
  return db.query(`SELECT id, body, date, answerer_name, helpfulness, photos FROM answersSHORT WHERE question_id=${question_id} AND reported=false ORDER BY helpfulness DESC;`)
}

const makeNewQuestion = (text, values) => {
  return db.query(text, values);
}

const makeNewAnswer = (text, values) => {
  return db.query(text, values);
}

const updateReport = (text) => {
  return db.query(text)
}

const updateHelpful = (text) => {
  return db.query(text)
}

const optimizingDbGET = (product_id, count, page) => {
  return db.query(`SELECT json_build_object
  ('question_id', q.questions_id, 'question_body', q.question_body, 'question_date', q.question_date,'asker_name', q.asker_name, 'question_helpfulness', q.question_helpfulness, 'reported', q.reported,
  'answers', (
  SELECT json_agg(
    json_build_object('id', a.id, 'body', a.body, 'date', a.date, 'answerer_name', a.answerer_name, 'helpfulness', a.helpfulness, 'photos', a.photos))
  FROM answersSHORT AS a WHERE a.question_id = q.questions_id) )
  FROM questionsSHORT AS q WHERE q.product_id=${product_id} AND q.reported='false' ORDER BY q.question_helpfulness DESC limit ${count};
  `)
}
//offset ${offset}
// SELECT json_build_object('question_id', q.questions_id, 'question_body', q.question_body, 'question_date', q.question_date, 'asker_name', q.asker_name, 'question_helpfulness', q.question_helpfulness, 'reported', q.reported, 'answers', (SELECT json_agg(json_build_object('id', a.id, 'body', a.body, 'date', a.date, 'answerer_name', a.answerer_name, 'helpfulness', a.helpfulness, 'photos', a.photos)) FROM answersSHORT AS a WHERE a.question_id = q.questions_id) ) FROM questionsSHORT AS q WHERE q.product_id = 14 AND q.reported = 'false' ORDER BY q.question_helpfulness DESC;

// limit 5
module.exports.optimizingDbGET = optimizingDbGET;
module.exports.updateHelpful = updateHelpful;
module.exports.updateReport = updateReport;
module.exports.makeNewQuestion = makeNewQuestion;
module.exports.makeNewAnswer = makeNewAnswer;
module.exports.getAllAnswers = getAllAnswers;
module.exports.getAllQuestions = getAllQuestions;
module.exports.setUpTablesAnswers = setUpTablesAnswers;
module.exports.setUpTablesQuestions = setUpTablesQuestions;