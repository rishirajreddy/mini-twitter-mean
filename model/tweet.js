const mongoose = require("mongoose");
const moment = require("moment");


const Comment = new mongoose.Schema({
    name: {
        type:String,
    },  
    comments: [
        {
            comment: String,
            commentedAt: {
                type:String,
                default: moment().format('YYYY-MM-DD'),
                required: true
            }
        }
    ],
})

const Tweet = new mongoose.Schema({
    username: String,
    tweets:[
        {
            username:{
                type:String
            },
            content:{
                type:String,
                required:true
            },
            createdAt: {
                type:String,
                default: moment().format('YYYY-MM-DD'),
                required:true
            },
            updatedAt:{
                type:String,
                default: moment().format('YYYY-MM-DD'),
                required:true
            },
            likedBy:{
                type:Array
            },    //users liked the tweet
            commentedBy:[Comment],       //users commented on the tweet
            comments:{
                type:Number,
                required:true,
                default: 0
            },
            liked:Boolean
    }
    ]
})


const tweetSchema = mongoose.model("tweet",Tweet);
const commentSchema = mongoose.model("comment",Comment);

module.exports = {
    Tweet: tweetSchema,
    Comment: commentSchema
}; 
// module.exports = mongoose.model("comment", Comment);