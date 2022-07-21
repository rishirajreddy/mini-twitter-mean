const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors')
const connectDb = require('./db/db');
const authRoutes = require('./routes/routes');
const tweetRoutes = require('./routes/tweet_routes');
const path = require("path");

var port = process.env.PORT || 3000;
require('dotenv').config();

connectDb();

// app.use(cors({origin: "http://localhost:64806"}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({extended: false}));
app.use('/api/v1/users', authRoutes)
app.use('/api/v1/tweets', tweetRoutes)

app.use(express.static(path.join(__dirname+'/public')))
app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'))
})
app.use((req, res, next) => {
    const error = new Error("Nothing Found!! Check your app again..");
    error.status = 404;
    next(error);
  });

app.get('/api/v1',(req,res) => {
    res.json({
        msg:"Welcome to API v1"    
    });
})
app.listen(port, () => {
    console.log(`Server up and running at port ${port}...`);
})