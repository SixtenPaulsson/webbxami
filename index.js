const express = require("express");
const {log, auth}=require("./mv");
const uniqid =require("uniqid")
const {saveToFile,getAllData}=require("./db");

const app = express();

app.listen(3456,err=>{
    if(err) return console.log(err);
    console.log("lyssnar på 3456");
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
let user = "user"


app.get("/guitars",log, index);
app.get("/guitars/:id", show)
app.delete("/guitar:id",destroy);
app.post("/guitar",auth(user),create);
app.put("/guitars/:id",update)

function update(req,res){
    let guitars=getAllData();
    let guitar = guitars.find(g=>g.id==req.params.id);
    if(!guitar) return res.status(400).json({error:"No Match"});
    let {title} = req.body;
    if(!title) return res.status(400).json({error:"No Data"});
    guitar.title=title;
    saveToFile(guitars);
    res.status(200).json(guitar);
}

function create(req,res){
    let {title} = req.body
    if(!title) return res.app

    let id = uniqid();

    let quitar = {id,title};

    guitars.push(guitar);
    saveToFile(guitars);
    res.status(201).json(guitar);
}

function show(req, res){
    let guitars=getAllData();
    let id = req.params.id;
    let guitar=guitars.find(g=>g.id==id);
    if(guitar) return res.status(200).json(guitar);
    saveToFile(guitars);
    res.status(204).end();
    
}
function index(req, res){
    console.log(req);
    res.json(guitars);
    
}

function destroy(req,res){
    let guitars=getAllData();
    let id = req.params.id;
    let filteredGuitars=guitars.filter(g=>g.id!=id);
    if(filteredGuitars.length<guitars.length){
        guitars=[...filteredGuitars];
        return res.status(200).json({deleted:"deleted "+id});
    }
    saveToFile(guitars);
    res.status(200).json({error:"nothing deleted"});
}


