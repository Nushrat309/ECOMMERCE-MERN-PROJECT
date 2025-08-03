const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');

const app = express();

app.use (xssClean('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/test', (req,res) => { 
    res.status(200).send({
        message:'api testing is working fine',
    });
});

app.get('/api/user', (req,res) => { 
    console.log(req.body.id);
    res.status(200).send({
        message:'user profile is returned',});
});

//client error handaling
app.use((req, res, next) => {
  next(createError(404, 'route not found'));
});

// server error handaling -> all the errors
app.use((err,req, res, next)=> {
   return res.status(err.status || 500).json({
    success: false,
    message: err.message,
   });
});

module.exports = app;