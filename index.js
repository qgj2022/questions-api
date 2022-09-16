const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// middleware
// app.use(express.JSON);

// request handlers
//for all data
app.get('/qa/questions', function (req, res) {

})

//for marking question helpful
app.put('/qa/questions/{question_id}/helpful', function (req, res) {

});

//for marking question report
app.put('/qa/questions/{question_id}/report', function (req, res) {

});

// for adding a question
app.post('/qa/questions', function (req, res) {
  req.body.body
  req.body.name
  req.body.email
  req.body.product_id
  // need time stamp
})

//for marking ANSWER as helpful
app.put('/qa/answers/{answer_id}/helpful', function (req, res) {

})

//for marking ANSWER as report
app.put('/qa/answers/{answer_id}/report', function (req, res) {

})

// for adding an answer
app.post('/qa/questions/{question_id}/answers', function (req, res) {
  req.body.body
  req.body.answerer_name
  req.body.photos
  req.body.email
  // need time stamp
})


// start server
app.listen(port);
console.log(`Listening at http://localhost:${port}`);