const express=require("express");
const connection=require("./config/db");
const cors=require("cors");
const userRouter = require("./routes/users.router");
const noteRouter = require("./routes/notes.router");
require("dotenv").config();
const authentication=require("./middleware/note.middleware");

const app=express();

app.use(cors({origin:"*"}));
// app.usecors({origin:"*"});

app.get("/",(req,res)=>{
    res.send({"msg":"Home Page","to explore go to":"/users or /notes"});
});

app.use(express.json());

app.use("/users",userRouter);

app.use(authentication);
app.use("/notes",noteRouter);

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("connected to DB");
    } catch(err){
        console.log(err);
        console.log("not connected to DB");
    }
    console.log(`server is running at port ${process.env.port}`);
});