//Imports
const bcrypt = require("bcrypt");
require("dotenv").config();

const express = require("express");
const db = require("./database");
const session = require("express-session");
const app = express();

const { decrypt } = require("dotenv");
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

app.get("/",async (req, res)=>{
    try {
        let houses = await db.mainData(req.session.user);
        const workers = await db.users("worker",1);
        res.render("houses",{title:"Houses",user:req.session.user,houses,workers});
    } catch (error) {
        return res.render("error",{error:error})
    }
});      
//#region get
app.get("/houses",async (req, res)=>{
    try {
        let houses = await db.houses();
        return res.json(houses);        
    } catch (error){
        return res.render("error",{error:error})
    }
});
app.get("/tasks",async (req, res)=>{
    try {
        let result = await db.tasks();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});
app.get('/usertasks',async (req, res)=>{
    try {
        let result = await db.userTasks();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});
app.get('/users',async (req, res)=>{
    try {
        let result = await db.users();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});
//#endregion
//#region post
app.post('/houses',auth,async (req, res)=>{
    try {
        house = req.body;
        house.ownerId=req.session.user.id
        console.log(house)
        await db.createHouse(house);
        return res.redirect("/");       
    } catch (error) {
        res.render("error",{error:error})
    }
});
app.post('/tasks',async (req, res)=>{
    
    task = req.body
    if(task.procent>100) task.procent=100
    try {
        let result = await db.createTask(task);
        return res.redirect("/")
    } catch (error) {
        return res.render("error",{error:error})
    }
});
app.post('/users',async (req, res)=>{
    try {
        user=req.body
        user.password = await bcrypt.hash(user.password,12);        
        console.log(process.env.secret);
        await db.createUser(user)
        return res.redirect("/");
        //return res.status(201).location('/')
        //return res.redirect("/") 
    } catch (error) {
        return res.render("error",{error:error});
    }
});
app.post('/usertasks',auth,async (req, res)=>{
    try {
        userName=await db.users("name",req.body.name)
        if (userName.length==0) return res.render("error",{error:{message:"Ingen user hittad"}})
        if(userName.length) userName=userName[0]
        usertask=req.body;
        usertask.userId = userName.id
        let result = await db.createUserTask(usertask)
        return res.redirect("/")
    } catch (error) {
        return res.render("error",{error:error});
    }
});
//#endregion

//#region delete
app.delete('/houses',async (req, res)=>{
    try {
        let result = await db.remove("houses",req.body.id);
        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error});
    }
});
app.delete('/tasks',async (req, res)=>{
    try {
        let result = await db.remove("tasks",req.body.id);

        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error})
    }
});
app.delete('/users',async (req, res)=>{
    try {
        let result = await db.remove("users",req.body.id);

        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error})
    }
});
app.delete('/usertasks',async (req, res)=>{
    try {
        let result = await db.remove("userTask",req.body.id);
        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error})
}});
//#endregion

//#region put

//#endregion
app.put("/houses",async (req, res)=>{
    let house = [
        { field:"address", value:req.body.address },
        { field:"description", value:req.body.description },
        { field:"price", value:req.body.price },
    ];
    try {
        await db.update("houses",house,req.body.id);
        return res.sendStatus(202)
    } catch (error) {
        return res.sendStatus(400)
    }
});

app.put('/tasks',async (req, res)=>{
    procent=req.body.procent
    if(procent>100) procent=100
    let task = [
        {field:"taskName", value:req.body.taskName },
        {field:"procent",  value:procent}
    ];
    try {
        let result = await db.update("tasks",task,req.body.id);
        console.log(result)
        return res.sendStatus(202)
        //return res.json(result)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
        //return res.render("error",{error:error})
    }
});
app.put('/users',async (req, res)=>{
    user = [
        { field:"name",value:req.body.name},
        { field:"password",value:req.body.password}
    ]
    try {
        let result = await db.update("users",user,req.body.id)
        return res.json(result)  
    } catch (error) {
        return res.render("error",{error:error});
    }
});


//#region auth
app.post('/login',async (req, res)=>{
    try {
        let user = await db.users("name",req.body.name)
        if(user.length!=1) return res.render("error",{error:{message:"Fel lösenord eller namn"}})
        if(await bcrypt.compare(req.body.password,user[0].password)==false) return res.render("error",{error:{message:"Fel lösenord eller namn"}})
        req.session.user=user[0]
        //req.session.cookie.expires = false;
        req.session.cookie.maxAge=30000;
        return res.redirect("/")
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.post('/logout',async (req, res)=>{
    req.session.user=undefined
    return res.redirect("/")
});
//#endregion

//#region middleware






function auth(req,res,next){
    if(!req.session.user) {
        return res.send("Must log in");
    }
    next();
}



function owns(){

    next();
}

function isPartOf(){

}


//#endregion
