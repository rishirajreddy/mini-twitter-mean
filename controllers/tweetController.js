const {Tweet} = require('../model/tweet')
const {Comment} = require('../model/tweet')
const User = require("../model/user")
const moment = require("moment");
const _ = require('lodash');
const mongoose = require("mongoose");

//get all tweets
//time based
exports.getAllTweets = async(req,res) => {
    let tweetsArr = [];

    await Tweet.find()
    .then((user) => {
        // res.json({user});
        for (let i = 0; i < user.length; i++) {
            tweetsArr.push(user[i]['tweets'])
        }   
        // let sortedArr = tweetsArr.flat().sort((a,b) => new moment(a.createdAt).format('YYYYMMDD') - new moment(b.createdAt).format('YYYYMMDD'),['asc'])
        let sortedArr = _.orderBy(tweetsArr.flat(), (o) => {
            return moment(o.createdAt).format('YYYYMMDD');
        },['desc'])

        res.json(sortedArr)
        console.log('Fetched');
    })
    .catch(err => console.error(err))
}

//creating a tweet
exports.createTweet = async(req,res) => {
    const {content} = req.body;
    const user = await Tweet.findOne({username:req.decoded.username})
    
    //check if user already exists in tweets collection
    //if yes , the just insert the comment into the tweets
    //array of the existing username
    if(!user){
        const tweet = new Tweet({
            username : req.decoded.username,
            tweets:{
                username:req.decoded.username,
                content:content
            }
        });
        await tweet.save()
        .then(() => {
            console.log("Tweet created successfully");
            res.json({
                msg:"Tweet created!!",
            })
        })
        .catch(err => {
            res.json({msg:err.Error})
            console.error(err)});
    }
    else {
         Tweet.findOneAndUpdate({username:req.decoded.username},
            {
                $addToSet: {
                    tweets:{
                        username:req.decoded.username,
                        content:content
                    }
                }
            },
            (err, data) => {
                if(err){
                    return res.status(500).json({msg:err})
                }else {
                    return res.status(200).json({msg:`Tweet created for the username ${req.decoded.username}`})
                }
            }
            )     
    }
}

//updating a tweet
exports.updateTweet = async(req,res) => {
    const tweet = await Tweet.findOne({username: req.decoded.username});
    const tweetID = tweet._id.toString();

    try {
        Tweet.findOneAndUpdate(
            {_id: tweetID},
            {$set: {"tweets.$[element].content": req.body.content, 
            "tweets.$[element].updatedAt": moment().format('YYYY-MM-DD'),
        }},
            {arrayFilters: [{"element._id": req.params.id}]},
            (err, result) => {
                if(err){
                    console.log(err);
                    res.status(500).json({msg:"Unable to update the tweet"})
                }else{
                    res.status(200).json({
                        msg:"Tweet updates successfully!!",
                        // tweet:result
                    })
                }
            }
        )
        
    }
    catch(err) {
        res.status(500).json({msg:err})
        console.error(err);
    }
}

//delete tweet
exports.deleteTweet = async(req,res) => {
    Tweet.findOneAndUpdate(
        {username:req.decoded.username},
        {$pull: {tweets: {_id: req.params.id}}},
        {safe: true, multi:true},
        function(err, data){
            if(err) {
                res.json({msg:err})
                console.log(err);
            }else {
                res.json({msg:"Deleted Successfully"})
            }
        }
        );
    }
    
//updating likes and comments of a user
exports.updateLikesAndComments = async(req,res) => {
    const user =  await User.findOne({username: req.decoded.username});
    const username = user.get("username");
    
    // if(!user){
    //     res.json({msg:"No tweet was found with the given username"})
    // }else {
        Tweet.findOne({"tweets":{$elemMatch: {_id: req.params.id}}}, 
        (err, tweet) => {
            if(err) {
                res.json({msg:"Invalid tweet id"})
                console.log(err)
            }else {
                if(!tweet){
                    console.log(tweet);
                    res.json({msg:"No tweet found with given id"})
                }else {
                    if(tweet.username === req.decoded.username){
                        res.json({msg:"Connot like your own post"})
                    }else {
                        console.log("Block entered");
                        for (const item of tweet.tweets) {
                            console.log(item);
                            if(item._id.toString() === req.params.id){
                                if(item.likedBy.includes(username)){
                                    const index = item.likedBy.indexOf(username)
                                    item.likedBy.splice(index,1);
                                    tweet.save()
                                        .then(() => {res.json({msg:"Tweet disliked", body:item})})
                                        .catch(err => {console.error(err);})
                                }else {
                                    item.likedBy.push(username);
                                    tweet.save()    
                                        .then(() => res.json({msg:"Tweet liked",body:item}))
                                        .catch(err => console.error(err))
                                }
                            }else {
                                console.log("No matching id found");
                            }
                            // res.json({msg:"Fetched"})
                        }
                        // tweet.save().then(() => res.json({msg:"Tweet updated"}));
                    }
                }
            }
        })
    }


//add comments
exports.addComments = async(req,res) => {
    const user = await User.findOne({username: req.decoded.username});
    const username = user.get("username");
    var inserted = false;  //to check if the data is pushed to the same username

    Tweet.findOne({"tweets":{$elemMatch: {_id: req.params.id}}},
    (err, tweet) => {
        if(err) {
            res.json({msg:"Invalid tweet id"})
        }else{ 
            if(!tweet){ 
                res.json({msg:"No tweet with the given id"})
            }else {
                for (const item of tweet.tweets) {
                    if(item._id.toString() === req.params.id){
                        for (const comment of item.commentedBy) {
                            if(comment.name === username){
                                comment.comments.push({comment: req.body.comments})
                                inserted = true;  //data is pushed
                                item.comments +=1;
                                console.log(tweet.tweets.comments);
                                tweet.save()
                                .then(() => res.json({msg:`Comment Added to the username ${username}`}))
                                .catch(err => console.log(err))
                            }
                        }
                        if(inserted === true) {    //if data pushed then exit
                            break;
                        }else {                    //if data is not pushed above, below will be executed
                            const newComment = new Comment({
                                name:username,
                                comments: {
                                    comment: req.body.comments
                                }
                            })
                            tweet.tweets.comments+=1;
                            console.log(newComment);
                            item.commentedBy.push(newComment);
                            item.comments +=1;
                            tweet.save()
                            .then(() => {res.json({msg:"Comment Added"})})
                            .catch(err => {
                                console.log(err)
                            })
                        }
                    }
                    else {
                        console.log("No matching id");
                    }
                }
                }
                
            }
    }
    )
}