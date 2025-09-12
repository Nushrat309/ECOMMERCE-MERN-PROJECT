const mongoose = require('mongoose');
const { mongodbURL } = require("../secret");

const connectDatabase = async () => {
    try {
        await mongoose.connect(mongodbURL, {
            ssl: true,
            tlsAllowInvalidCertificates: false
        });
        console.log('Connection to DB is successfully established');

        mongoose.connection.on('error', (error) => {
            logger.log('error','DB connection error: ', error);
        });
    } catch (error) {
        logger.log('error','Could not connect to DB: ', error.toString());
    }
};

module.exports = connectDatabase;
