const mongoose = require('mongoose');

const user = mongoose.Schema({
    username: {
        type:String,
        unique:true,
        required:true
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    }
})

module.exports = mongoose.model('user',user);


// [[1,2,3],[1,2]]

[
    [
      { //0
        "username": "msdhoni",
        "content": "Captain of all Captains!!",
        "createdAt": "Tuesday, July 12, 2022 10:30 PM",
        "updatedAt": "Tuesday, July 12, 2022 10:30 PM",
        "likedBy": [],
        "commentedBy": [],
        "_id": "62cda8c56593df5dd6a72ad1"
      },
      { //
        "username": "msdhoni",
        "content": "Don't mess with Thomas shelby!!",
        "createdAt": "Tuesday, July 12, 2022 11:52 PM",
        "updatedAt": "Tuesday, July 12, 2022 11:52 PM",
        "likedBy": [],
        "commentedBy": [],
        "_id": "62cdbbf13075a9f01f3688f5"
      },
      {
        "username": "msdhoni",
        "content": "Hey there elliot here",
        "createdAt": "Tuesday, July 12, 2022 11:52 PM",
        "updatedAt": "Tuesday, July 12, 2022 11:52 PM",
        "likedBy": [],
        "commentedBy": [],
        "_id": "62cdbf073075a9f01f368915"}],
    [
      {
        "username": "rishi007",
        "content": "Watching Stranger things!!",
        "createdAt": "Tuesday, July 12, 2022 10:30 PM",
        "updatedAt": "Tuesday, July 12, 2022 10:30 PM",
        "likedBy": [],
        "commentedBy": [],
        "_id": "62cda9326593df5dd6a72ad9"
      },
      {
        "username": "rishi007",
        "content": "Don't mess with Thomas shelby!!",
        "createdAt": "Tuesday, July 12, 2022 11:52 PM",
        "updatedAt": "Tuesday, July 12, 2022 11:52 PM",
        "likedBy": [],
        "commentedBy": [],
        "_id": "62cdbbd63075a9f01f3688f1"
      }
    ]
  ]