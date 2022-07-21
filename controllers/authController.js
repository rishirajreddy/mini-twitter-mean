const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require('../model/user');
const bcrypt = require("bcryptjs");


exports.getAllUsers = async(req,res) => {
    await User.find()
    .then((user) => {
        res.json({msg:user})
    })
    .catch(err => console.log(err))
}

//registering user
exports.registerUser = async(req, res) => {
    const {username, email, password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        username,
        email,
        password: hashPassword
    });
    
            let token = jwt.sign({username:req.body.username}, 
                config.key,{
                    expiresIn: "1h"
                })
              await newUser.save()
            .then(() => {
                console.log("User registered!!");
                res.json({
                    msg:"User registered successfully!!",
                    data: {
                        username,
                        token
                    }
                })
            })
            .catch((err) => {
                if(err.code === 11000 && err.keyValue.username === req.body.username){
                    res.json({msg:"User with the given username already exists", 
                    username:username})
                }else {
                    res.json({msg:"User with the given email already exists",
                    email:email
                })
                }
                // console.log(err)
            });
        }


//signing user
exports.loginUser = async(req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    try {
        if(!user){
            return res.status(404).json({
                status:"Login Failed!!",
                msg:"User not found!!"
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if(isCorrect){
            let token = jwt.sign({username:req.body.username},
                config.key,{
                    expiresIn: "1h"
                }
                );
            res.status(200).json({
                status:"User found!!",
                username: req.body.username,
                msg:"Login Success",
                token:token
            })
            console.log("Login SUccess");
        }else {
            res.status(401).json({
                msg:"Incorrect password or email"});
            console.log("Login failed!!");
        }
    }
    catch{
        res.status(500).send();
    }
}

//updating the user
exports.updateUser = async(req,res) => {
    const user = await User.findOne({username: req.decoded.username});
    try {
        User.updateOne(
            user,
            {$set: {email: req.body.email}},
            (err,result) => {
                if(err) {
                    res.status(500).json({msg:err})
                }else{
                    res.status(200).json({
                        msg:"Updated Successfully",
                        user:user
                    })
                }
            }
        )
    }
    catch(err){
        res.status(500).json({msg:err})
        console.error(err);
    }
}
