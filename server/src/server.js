const express = require('express');
const morgan = require('morgan');
const app = express();

app.use (morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const isLoggedIn=(req, res, next)=>{
    const login = true;
    if (login) {
        req.body.id = 101;
        next();
    } else {
        return res.status(401).json({message: 'please login first' });
    }
};

app.use(isLoggedIn);

app.get('/test', (req,res) => { 
    res.status(200).send({
        message:'api testing is working fine',
    });
});

app.get('/api/user', isLoggedIn, (req,res) => { 
    console.log(req.body.id);
    res.status(200).send({
        message:'user profile is returned',});
});
//client error handaling
app.use((req,res,next) => {
  res.status(404).json({message: 'route not found'});
  next();
});

// server error handaling
app.use((err,req, res, next)=> {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3001,() => {
    console.log('server is running at http://localhost:3001');
});