var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('./db/connect');

var app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
      res.setHeader('Content-Type', 'application/json');
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
