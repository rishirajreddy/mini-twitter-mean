const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const url = "mongodb+srv://mrrobot:mrrobot@empmngmt.cs734kp.mongodb.net/test-2?retryWrites=true&w=majority";

const connect = () => {
    mongoose.connect(url, {
        useNewUrlParser : true, useUnifiedTopology: true
    });
    console.log("Connected to database!!");
}

module.exports = connect;