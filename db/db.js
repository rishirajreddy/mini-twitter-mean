const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser : true, useUnifiedTopology: true
    });
    console.log("Connected to database!!");
}

module.exports = connect;