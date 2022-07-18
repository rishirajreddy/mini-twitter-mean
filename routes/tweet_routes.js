const express = require('express');
const router = express.Router();
const middleware = require("../middlewares/middleware");
const tweetController = require("../controllers/tweetController");

router.route("/getAllTweets").get(middleware.checkToken,tweetController.getAllTweets);
router.route("/createTweet").post(middleware.checkToken,tweetController.createTweet);
router.route("/updateTweet/:id").patch(middleware.checkToken,tweetController.updateTweet);
router.route("/deleteTweet/:id").delete(middleware.checkToken,tweetController.deleteTweet);
router.route("/likeTweet/:id").patch(middleware.checkToken,tweetController.updateLikesAndComments);
router.route("/addComment/:id").post(middleware.checkToken,tweetController.addComments);

module.exports = router;