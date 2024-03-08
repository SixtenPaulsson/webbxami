
//Imports
const express = require("express");
const db = require("./database");
const session = require("express-session");
const app = express();
const uniqid = require("uniqid");
app.use(express.json());       
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');

//Lyssna

//Kanske inte behövs men det känns bra att ha ändå
app.set('trust proxy',1)
app.set('json spaces', 2)
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{ }
}));


app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("http://localhost:3456");   
});

//Routes

//getRoute




app.get("/",async (req, res)=>{

    let houses = await db.houses();
    //console.log(houses)
    res.render("houses",{title:"Houses",user:req.session.user,houses});
    //res.json(houses[0].tasks[0].taskName)
});

//Route för att få ut alla hus i json, finns mest i debug syfte för postman
app.get("/houses",async (req, res)=>{
    let houses = await db.houses();
    res.json(houses);
    //res.json(houses[0].tasks[0].taskName)
});

app.post('/houses',auth,async (req, res)=>{
    //console.log("hej")
    house = {
        id:uniqid(),
        ownerId:req.session.user.id,
        address:req.body.address,
        description:req.body.description,
        price:req.body.price
    }
    try {
        let result = await db.createHouse(house);
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
    res.json(await db.tasks());
});
app.post('/tasks',async (req, res)=>{
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
        return res.redirect("/")
        
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});
app.delete('/tasks',async (req, res)=>{
    try {
        let result = await db.deleteTask(req.body.id);
        return res.sendStatus(204)
        //res.json(houses)
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});

app.get('/users',async (req, res)=>{
    try {
        let result = await db.users();
        return res.json(result)
        
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});

app.post('/users',async (req, res)=>{
        user = {
            id:uniqid(),
            worker:req.body.worker=="on",
            name:req.body.name,
            password:req.body.password
        }
        try {
            let result = await db.createUser(user)
            //console.log(result)
            return res.redirect("/")
            
        } catch (error) {
            console.log(error)
            return res.render("error",{err:"something wrong",error:error})
        }
    

});

app.post('/login',async (req, res)=>{
    try {
        let result = await db.login(req.body.name,req.body.password);
        if(result[0]!=undefined){
            req.session.user=result[0]
            req.session.cookie.maxAge=30000
        }
        return res.redirect("/")
        
    } catch (error) {
        console.log(error)
        return res.render("error",{err:"something wrong",error:error})
    }
});


app.post('/logout',auth,async (req, res)=>{
    req.session.user=undefined
    return res.redirect("/")
});


app.get('/vff',async (req, res)=>{
    let values = await db.valueFromField("users","","Sixten");
    res.json(values);
});

function auth(req,res,next){
    if(!req.session.user) {
        return res.send("Must log in");
    }
    next();
}