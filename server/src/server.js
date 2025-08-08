const { serverPort } = require('./secret');
const app = require('./app');
const connectDatabase = require('./config/db');

app.listen(serverPort, async() => {
    console.log(`server is running at http://localhost:${serverPort}`);
    await connectDatabase();
});