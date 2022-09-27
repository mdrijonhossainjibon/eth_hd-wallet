ROOT_FOLDER = __dirname;
require('dotenv').load();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sendResponse = (req, res, next) => {
  res.sendResponse = (body, message, code) => {
    let response = {};
    response['statusCode'] = code || 200;
    response['status'] = 'success';
    response['message'] = message || 'success';
    response['body'] = body;
    res.json(response);
  };
  next();
};
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
const sendError = (err, req, res, next) => {
  let response = {};
  response['status'] = 'fail';
  response['statusCode'] = 500;
  response['message'] = err.message;
  response['body'] = err;
  res.json(response);
};
app.use(allowCrossDomain);
app.use(sendResponse);
app.use('/api', apiRouter);
app.use(sendError);

app.listen(8080, () => console.log('server running at port 8080'));
