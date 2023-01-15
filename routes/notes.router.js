const {Router}=require("express");
const noteModel = require("../model/notes.model");

const noteRouter=Router();

noteRouter.post("/create",async(req,res)=>{
    let data=req.body;
    let note=new noteModel(data);
    await note.save();
    res.send("note created");
});

noteRouter.get("/",async(req,res)=>{
    let all=await noteModel.find();
    res.send(all);
});

noteRouter.patch("/update/:id",async(req,res)=>{
    let ID=req.params.id;
    let checkID=req.body.userID;
    let Notes=await noteModel.findOne({_id:ID});
    if(Notes){
        if(Notes.userID===checkID){
            let upNote=req.body;
            await noteModel.findOneAndUpdate({_id:ID},upNote);
            res.send("note updated");
        } else {
            res.send("try to update your notes");
        }
    } else {
        res.send("Note not found");
    }
});

noteRouter.delete("/delete/:id",async(req,res)=>{
    let ID=req.params.id;
    let note=await noteModel.findOne({_id:ID});
    if(note.userID===req.body.userID){
        await noteModel.findOneAndDelete({_id:ID});
        res.send("note deleted");
    } else {
        res.send("try to delete your notes");
    }
});

module.exports=noteRouter;