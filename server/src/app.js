const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter');
const seedRouter = require('./routers/seedRouter');
const { errorResponse, successResponse } = require('./controllers/responseController');
const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/authRouter');
const productRouter = require('./routers/authRouter');

const app = express();

const rateLimiter = rateLimit({
    windows: 1 * 60 * 1000, //1 minute,
    max: 5,
    message: 'Too many requests from this IP. please try again later',
});

app.use(cookieParser());
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/seed', seedRouter);
app.use('/api/auth',authRouter);
app.use('/api/categories',categoryRouter);
app.use('/api/products',productRouter);


app.get('/test', (req, res) => {
    res.status(200).send({
        message: 'api testing is working fine',
    });
});

//client error handaling
app.use((req, res, next) => {
    next(createError(404, 'route not found'));
});

// server error handaling -> all the errors
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    })

});

module.exports = app;