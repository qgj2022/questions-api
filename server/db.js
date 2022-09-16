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

db.connect();

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

  //id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful
  await db.query(`CREATE TABLE answersSHORT(
    id serial NOT NULL,
    question_id int NOT NULL,

    body character varying (1000) NOT NULL,
    date text NOT NULL,
    answerer_name character varying (60) NOT NULL,
    answerer_email character varying (60) NOT NULL,
    reported boolean NOT NULL,
    helpfulness integer NOT NULL,

    PRIMARY KEY (answers_id)
    );`
  );
}


// module.exports.db = db;
module.exports.setUpTablesAnswers = setUpTablesAnswers;
module.exports.setUpTablesQuestions = setUpTablesQuestions;