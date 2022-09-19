const express = require('express');
const path = require('path');
const { makeResponseGETqanda, insertInto } = require('./serviceFunctions.js');
const { updateHelpful, updateReport } = require('./dbQueries.js');

const app = express();
const port = 3000;

// middleware
app.use(express.json());


const logger = (req) => {
  console.log(`Received: ${req.method} ${req.path} Body: ${req.body}`);
}

// request handlers
app.get('/qa/questions', async function (req, res) {
  logger(req);
  let product_id = req.body.product_id;
  makeResponseGETqanda(product_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err)
      res.send(err)
    })
})

//for marking question helpful
app.put(/^\/qa\/questions\/[^/]*\/helpful/, (req, res) => {
  logger(req);
  let id = req.path.split('/')[3];
  updateHelpful(`UPDATE questionsSHORT SET question_helpfulness = question_helpfulness + 1 WHERE questions_id = ${id};`)
    .then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=> {
      console.log(err);
      res.send(err)
    })
});

//for marking question report
app.put(/^\/qa\/questions\/[^/]*\/report/, (req, res) => {
  logger(req);
  let id = req.path.split('/')[3];
  updateReport(`UPDATE questionsSHORT SET reported = true WHERE questions_id = ${id};`)
    .then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=> {
      console.log(err);
      res.send(err)
    })
});

//for marking ANSWER as helpful
app.put(/^\/qa\/answers\/[^/]*\/helpful/, function (req, res) {
  logger(req);
  let id = req.path.split('/')[3];
  updateHelpful(`UPDATE answersSHORT SET helpfulness = helpfulness + 1 WHERE id = ${id};`)
    .then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=> {
      console.log(err);
      res.send(err)
    })
})

//for marking ANSWER as report
app.put(/^\/qa\/answers\/[^/]*\/report/, function (req, res) {
  logger(req);
  let id = req.path.split('/')[3];
  updateReport(`UPDATE answersSHORT SET reported = true WHERE id = ${id};`)
    .then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=> {
      console.log(err);
      res.send(err)
    })
})
// for adding an answer
app.post(/^\/qa\/questions\/[^/]*\/answers/, function (req, res) {
  logger(req);
  //add date
  let date = new Date();
  req.body.date = date;
  // add questionID
  let question_id = req.path.split('/');
  req.body.question_id = question_id[3];
  // insert into database
  insertInto(req.body, 'answer')
    .then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=> {
      console.log(err);
      res.sendStatus(500)
    })
})

// for adding a question
app.post('/qa/questions', function (req, res) {
  logger(req);
  let date = new Date();
  req.body.date = date;
  insertInto(req.body, 'question')
    .then(()=>{
      res.sendStatus(200);
    })
    .catch((err)=> {
      console.log(err);
      res.sendStatus(500)
    })
})

module.exports = app;