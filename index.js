
//Imports
const express = require("express");
const db = require("./database");
const app = express()
app.use(express.json());       
app.use(express.urlencoded({ extended: true }))
//
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug')
let uniqid = require("uniqid")
//Lyssna
app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("http://localhost:3456");   
});




//Routes

//getRoute

app.get("/",async (req, res)=>{
    let houses = await db.houses();
    //print("asd")
    res.render("houses",{title:"Houses",houses});
    //res.json(houses)
});

app.get("/create",async (req, res)=>{
    //let houses = await db.houses();
    res.render("createHouse");
});
app.get("/houses",async (req, res)=>{

    let houses = await db.houses();
    //console.log(houses)
    //res.render("houses",{title:"Houses",houses});
    res.json(houses);
});
//Post route
app.post('/houses',async (req, res)=>{
    //console.log("hej")
    //console.log(req.body)
    house = {
        id:uniqid(),
        address:req.body.address,
        description:req.body.description,
        price:req.body.price
    }
    try {
        let result = await db.createHouse(house);
        console.log(result)
        res.status(201)
        
    } catch (error) {
        console.log(error)
        return ({error:"something wrong",err:error})
    }
    res.json(result)
});


app.delete('/houses',async (req, res)=>{
    //console.log("hej")
    //console.log(req.body)
    try {
        let result = await db.deleteHouse(req.body.id);
        console.log(result)
        
        return res.json({message:"something happend"});
        //res.json(houses)
    } catch (error) {
        console.log(error)
        return res.json({error:"something wrong",err:error})
    }
    
});


