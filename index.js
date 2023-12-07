const express = require("express");
const {log, auth} = require("./mw");
const {saveToFile, getAllData} = require("./db");
const uniqid = require("uniqid");

const app = express();

app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("lyssnar på 3456");   
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());


/* let guitars = [
    {id:1, title:"Les Paul"},
    {id:2, title:"cheep pro EKO"},
    {id:3, title:"Custom bullshit"},
    {id:4, title:"Strat from hell"}
]; */


let user = "user";


app.get("/guitars",log, index);
app.post("/guitars", create);
app.get("/guitars/:id",log, auth(user), show);
app.delete("/guitars/:id", destroy);
app.put("/guitars/:id", update);


function update(req, res){

    let guitars = getAllData();
    let guitar = guitars.find(g=>g.id == req.params.id);

    if(!guitar) return res.status(400).json({error: "No match"});
   

    let {title} = req.body;

    if(!title) return res.status(400).json({error: "No data"});


    guitar.title = title;

    saveToFile(guitars);
    res.status(200).json(guitar);


}



function create(req, res){


    let {title} = req.body;
    if(!title) return res.status(400).json({error:"No data"});

    let id = uniqid();

    let guitar = {id, title};



    let guitars = getAllData();
    guitars = [guitar, ...guitars];  // lägg till först
    saveToFile(guitars);
    res.status(201).json(guitar);


}



function destroy(req, res){

    let id = req.params.id;
    let guitars = getAllData();
    let filteredGuitars = guitars.filter(g=>g.id!=id);
    if(filteredGuitars.length<guitars.length)
    {
        guitars = [...filteredGuitars];
        saveToFile(guitars);
        return res.status(200).json({message:"deleted "+id});
    }
   
   
    res.status(200).json({error: "nothing deleted"});

}


function show(req, res){

    let id = req.params.id;
    let guitars = getAllData();
    let guitar = guitars.find(g=>g.id==id);
    if(guitar) return res.status(200).json(guitar);

    res.status(204).end();


}

function index(req, res){
    let guitars = getAllData();
    res.json(guitars);
}



