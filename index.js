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
//session.maxAge=20000
//app.use(getUser);
app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("http://localhost:3456");   
});

//Routes

//getRoute




app.get("/",async (req, res)=>{
    try {
        let houses = await db.mainData(req.session.user)
        
        console.log(houses)
        if(houses.sqlMessage) return res.render("error",{error:houses.sqlMessage})
        res.render("houses",{title:"Houses",user:req.session.user,houses});
    } catch (error) {
        return res.render("error",{error:error})
    }
});                                                                 

//Route för att få ut alla hus i json, finns mest i debug syfte för postman
app.get("/houses",async (req, res)=>{
    try {
        let houses = await db.houses();
        if(houses.sqlMessage){
            return res.render("error",{error:houses.sqlMessage})
        }
        return res.json(houses);        
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.post('/houses',auth,async (req, res)=>{

    try {
        house = {
            id:uniqid(),
            ownerId:req.session.user.id,
            address:req.body.address,
            description:req.body.description,
            price:req.body.price
        }
        let result = await db.createHouse(house);
        if(result.sqlMessage) return res.render("error",{error:result.sqlMessage})

        return res.redirect(201,"/");
        
    } catch (error) {
        res.render("error",{error:error})
    }
});
app.delete('/houses',async (req, res)=>{
    try {
        let result = await db.deleteHouse(req.body.id);
        if(result.sqlMessage) return res.render("error",{error:result.sqlMessage});
        return res.send(204)
    } catch (error) {
        return res.render("error",{error:error})
}});
app.get("/tasks",async (req, res)=>{
    return res.json(await db.tasks());
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
        return res.render("error",{error:error})
    }
});
app.delete('/tasks',async (req, res)=>{
    try {
        let result = await db.deleteTask(req.body.id);
        return res.sendStatus(204)
        //res.json(houses)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.get('/users',async (req, res)=>{
    try {
        let result = await db.users();
        if(result.sqlMessage) return res.render("error",{error:result.sqlMessage})
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.post('/users',async (req, res)=>{

        try {
            user = {
                id:uniqid(),
                worker:req.body.worker=="on",
                name:req.body.name,
                password:req.body.password
            }
            console.log(user)
            let result = await db.createUser(user)
            if(result.sqlMessage) return res.render("error",{error:result.sqlMessage})
            return res.json(result)
            
        } catch (error) {
            return res.render("error",{error:error})
        }
    

});

app.post('/login',async (req, res)=>{
    try {
        let result = await db.login(req.body.name,req.body.password);
        if(result.sqlMessage) return res.render("error",{error:result.sqlMessage})

        if(result.length==1){
            req.session.user=result[0]
            req.session.cookie.expires = false;
            req.session.cookie.maxAge=30000
        }
        return res.redirect("/")
        
    } catch (error) {
        return res.render("error",{error:error})
    }
});


app.post('/logout',auth,async (req, res)=>{
    req.session.user=undefined
    return res.redirect("/")
});


/* app.get('/vff',async (req, res)=>{
    let values = await db.valueFromField("users","","Sixten");
    res.json(values);
}); */



app.post('/usertasks',auth,async (req, res)=>{
    try {
        const usertask = {
            id:uniqid(),
            userId:req.session.user.id,
            taskId:req.body.taskId,
        }
        let result = await db.createUserTask(usertask)
        //.log(result)
        if(result.sqlMessage){
            return res.render("error",{error:sqlMessage})
        }
        return res.redirect("/")
    } catch (error) {
        res.json(error)
    }
    return res.redirect("/")
});

app.get('/usertasks',async (req, res)=>{
    try {
        let result = await db.userTasks();
        if(result.sqlMessage) return res.render("error",{error:result.sqlMessage})
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.delete('/usertasks',async (req, res)=>{
    try {
        let result = await db.deleteUserTask(req.body.id);
        if(result.sqlMessage) return res.render("error",{error:result.sqlMessage});
        return res.send(204)
    } catch (error) {
        return res.render("error",{error:error})
}});



//Middleware



function auth(req,res,next){
    if(!req.session.user) {
        return res.send("Must log in");
    }
    next();
}




