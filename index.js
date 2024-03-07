
//Imports
const express = require("express");
const db = require("./database");
const session = require("express-session");
const app = express()
app.use(express.json());       
app.use(express.urlencoded({ extended: true }))
//
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug')
let uniqid = require("uniqid")
//Lyssna

//Kanske inte behövs men det känns bra att ha ändå
app.set('trust proxy',1)
//req.session.cookie.maxAge=30000
//3600000
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{ }
}));


/* app.get("/session",(req,res)=>{


    //Fake login

    req.session.user={id:34,user_name:"Lenny",shoe_size:34}

    res.json(req.session)
}) */

app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("http://localhost:3456");   
});

//Routes

//getRoute




app.get("/",async (req, res)=>{

    let houses = await db.houses();
    console.log(houses)
    res.render("houses",{title:"Houses",user:req.session.user,houses});
    //res.json(houses[0].tasks[0].taskName)
});

//Route för att få ut alla hus i json, finns mest i debug syfte för postman
app.get("/houses",async (req, res)=>{
    let houses = await db.houses();
    res.json(houses);
    //res.json(houses[0].tasks[0].taskName)
});

app.post('/houses',async (req, res)=>{
    //console.log("hej")
    console.log(req.body)
    house = {
        id:uniqid(),
        address:req.body.address,
        description:req.body.description,
        price:req.body.price
    }
    try {
        let result = await db.createHouse(house);
        console.log(result)
        return res.redirect("/");
        
    } catch (error) {
        console.log(error)
        res.render("error",{err:"something wrong",error:error})
    }
});
app.delete('/houses',async (req, res)=>{

    try {
        let result = await db.deleteHouse(req.body.id);
        //console.log(result)
        
        return res.send(204)
        //res.json(houses)
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
}});
app.get("/tasks",async (req, res)=>{
    let tasks = await db.tasks();
    //console.log(houses)
    //res.render("houses",{title:"Houses",houses});
    res.json(tasks);
});
app.post('/tasks',async (req, res)=>{
    //console.log("hej")
    //console.log(req.body)
    console.log(req.body)
    procent=req.body.procent
    if(procent>100) procent=100
    task = {
        id:uniqid(),
        taskName:req.body.taskName,
        procent:procent,
        houseId:req.body.houseId
    }
    try {
        let result = await db.createTask(task);
        console.log(result)
        return res.redirect("/")
        
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});
app.delete('/tasks',async (req, res)=>{
    try {
        let result = await db.deleteTask(req.body.id);
        console.log(result)
        
        return res.sendStatus(204)
        //res.json(houses)
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});



app.post('/users',async (req, res)=>{
    //console.log("hej")
    //console.log(req.body)
    console.log(req.body)
    procent=req.body.procent
    if(procent>100) procent=100
    task = {
        id:uniqid(),
        taskName:req.body.taskName,
        procent:procent,
        houseId:req.body.houseId
    }
    try {
        let result = await db.createTask(task);
        console.log(result)
        return res.redirect("/")
        
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});

app.post('/login',async (req, res)=>{
    //console.log("hej")
    //console.log(req.body)
    console.log(req.body)
    procent=req.body.procent
    if(procent>100) procent=100
    task = {
        id:uniqid(),
        taskName:req.body.taskName,
        procent:procent,
        houseId:req.body.houseId
    }
    try {
        let result = await db.createTask(task);
        console.log(result)
        return res.redirect("/")
        
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});



function auth(req,res,next){
    if(!req.session.user) {
        return res.send("Must log in");
    }
    next();
}