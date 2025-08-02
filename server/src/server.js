const express = require('express');
const app = express();

app.get('/',(req, res) => {
    res.status(200).send({
        message: 'Welcome to the server made by Nupur!',
    });
});

app.get('/products',(req, res) => {
    console.log('GET / was called');
    res.status(200).send({
        message: 'products are returned',
    });
});

app.listen(3001,() => {
    console.log('server is running at http://localhost:3001');
});