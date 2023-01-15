const {Router}=require("express");
const userModel=require("../model/users.model");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRouter=Router();

userRouter.post("/register",(req,res)=>{
    try{
        let r=Number(process.env.saltRounds);
        bcrypt.hash(req.body.password, r, async(err, hash)=>{
            req.body.password=hash;
            let use=new userModel(req.body);
            await use.save();
        });
        res.send("Registered Succesfully");
    } catch(err) {
        console.log(err);
        res.send("not registered");
    }
});

userRouter.get("/",async(req,res)=>{
    let all=await userModel.find();
    res.send("Home Page");
});

userRouter.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let data=await userModel.find({email:email});
    if(data.length>0){
        bcrypt.compare(password, data[0].password, (err, result)=>{
            // result == true
            if(result){
                const token=jwt.sign({userID:data[0]._id},process.env.secretKey);
                res.send({"msg":"Logged in succesfullt","token":token});
            } else {
                res.send("wrong email or password");
            }
        });
    } else {
        res.send("no user found please register");
    }
});

userRouter.patch("/update/:id",async(req,res)=>{
    let token=req.headers.authorization;
    let ID=req.params.id;
    if(token){
        const decoded = jwt.verify(token, process.env.secretKey);
        if(decoded){
            let user=await userModel.find({_id:ID});
            if(user.length>0){
                await userModel.findByIdAndUpdate({_id:ID},req.body);
                res.send("user data updated");
            } else {
                res.send("user not found");
            }
        } else {
            console.log(err);
            res.send("Login first");
        }
    }
});

userRouter.delete("/delete/:id",async(req,res)=>{
    let token=req.headers.authorization;
    let ID=req.params.id;
    if(token){
        const decoded = jwt.verify(token, process.env.secretKey);
        if(decoded){
            await userModel.findByIdAndDelete({_id:ID});
            res.send("user removed");
        } else {
            console.log(err);
            res.send("Login first");
        }
    }
});


userRouter.get("/logout",(req,res)=>{
    req.headers.authorization="";
    res.send("Logged Out");
});

module.exports=userRouter;