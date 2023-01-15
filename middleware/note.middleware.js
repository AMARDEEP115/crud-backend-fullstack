const jwt=require("jsonwebtoken");
require("dotenv").config();

const authentication=(req,res,next)=>{
    let token=req.headers.authorization;
    if(token){
        let decoded=jwt.verify(token,process.env.secretKey);
        if(decoded){
            req.body.userID=decoded.userID;
            next();
        } else {
            res.send("login first");
        }
    } else {
        res.send("login first");
    }
}

module.exports=authentication;