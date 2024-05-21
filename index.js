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
        res.render("main",{title:"Houses",user:req.session.user,houses,workers});
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




app.get("/tasks",auth,async (req, res)=>{
    try {
        let result = await db.tasks();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.get("/suggestions",auth,async (req, res)=>{
    try {
        let result = await db.suggestions();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.get('/usertasks',auth,async (req, res)=>{
    try {
        let result = await db.userTasks();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.get('/userhouses',auth,async (req, res)=>{
    try {
        let result = await db.userHouse();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.get('/users',auth,async (req, res)=>{
    try {
        let result = await db.users();
        return res.json(result)
    } catch (error) {
        return res.render("error",{error:error})
    }
});
//#endregion
//#region post
app.post('/houses',auth,isUser,getHouseId,ownOrPartOf,async (req, res)=>{
    try {
        house = req.body;
        house.ownerId=req.session.user.id
        await db.createHouse(house);
        return res.redirect("/");       
    } catch (error) {
        res.render("error",{error:error})
    }
});
app.post('/tasks',auth,isUser,ownOrPartOf,async (req, res)=>{
    
    task = req.body
    if(task.procent>100) task.procent=100
    try {
        let result = await db.createTask(task);
        return res.redirect("/")
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.post('/suggestions',auth,ownOrPartOf,async (req, res)=>{    
    suggestion = req.body
    suggestion.userId = req.session.user.id
    try {
        let result = await db.createSuggestion(suggestion);
        return res.redirect("/")
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.post('/users',auth,isUser,async (req, res)=>{
    try {
        user=req.body
        user.password = await bcrypt.hash(user.password,12);    
        user.worker = true
        await db.createUser(user)
        return res.redirect("/");
    } catch (error) {
        return res.render("error",{error:error});
    }
});
app.post('/usertasks',auth,isUser,ownOrPartOf,async (req, res)=>{
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

app.post('/userhouses',auth,isUser,ownOrPartOf,async (req, res)=>{
    try {
        userName=await db.users("name",req.body.name)
        if (userName.length==0) return res.render("error",{error:{message:"Ingen user hittad"}})
        if(userName.length) userName=userName[0]
        userhouse=req.body;
        userhouse.userId = userName.id
        let result = await db.createUserHouse(userhouse)
        return res.redirect("/")
    } catch (error) {
        return res.render("error",{error:error});
    }
});

//#endregion

//#region delete
app.delete('/houses',auth,isUser,ownOrPartOf,async (req, res)=>{
    try {
        let result = await db.remove("houses",req.body.id);
        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error});
    }
});
app.delete('/tasks',auth,isUser,ownOrPartOf,async (req, res)=>{
    try {
        let result = await db.remove("tasks",req.body.id);

        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error})
    }
});

app.delete('/suggestions',auth,ownOrPartOf,async (req, res)=>{
    try {
        let result = await db.remove("suggestions",req.body.id);
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
app.delete('/usertasks',auth,ownOrPartOf,async (req, res)=>{
    try {
        let result = await db.remove("userTask",req.body.id);
        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error})
}});

app.delete('/userhouses',auth,ownOrPartOf,async (req, res)=>{
    try {
        let result = await db.remove("userHouse",req.body.id);
        return res.sendStatus(204)
    } catch (error) {
        return res.render("error",{error:error})
}});


//#endregion

//#region put

//#endregion
app.put("/houses",auth,isUser,ownOrPartOf,async (req, res)=>{
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

app.put('/tasks',auth,ownOrPartOf,async (req, res)=>{
    procent=req.body.procent
    if(procent>100) procent=100
    let task = [
        {field:"taskName", value:req.body.taskName },
        {field:"procent",  value:procent}
    ];
    try {
        let result = await db.update("tasks",task,req.body.id);
        return res.sendStatus(202)
        //return res.json(result)
    } catch (error) {
        return res.sendStatus(400)
        //return res.render("error",{error:error})
    }
});

app.put('/suggestions',auth,ownOrPartOf,async (req, res)=>{
    let suggestion = [
        {field:"text", value:req.body.text },
        {field:"description", value:req.body.description }
    ];
    try {
        let result = await db.update("suggestions",suggestion,req.body.id);
        return res.sendStatus(202)
        //return res.json(result)
    } catch (error) {
        return res.sendStatus(400)
        //return res.render("error",{error:error})
    }
});

/* app.put('/users',async (req, res)=>{
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
}); */


//#region auth
app.post('/login',async (req, res)=>{
    try {
        let user = await db.users("name",req.body.name)
        if(user.length!=1) return res.render("error",{error:{message:"Fel lösenord eller namn"}})
        if(await bcrypt.compare(req.body.password,user[0].password)==false) return res.render("error",{error:{message:"Fel lösenord eller namn"}})
        req.session.user=user[0]
        //req.session.cookie.expires = false;
        req.session.cookie.maxAge=240000;
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

async function log(req,res,next){
    if(req.body.id) console.log(await db.getObjectFromId(req.body.id))
    next()
}

async function ownOrPartOf(req,res,next){
    try {
        //Försöker hämta ut det objekt man ska ändra på ta bort
        let object = await db.getObjectFromId(req.body.id)
        //Ifall det inte finns är det en post istället
        if(object == undefined) object=req.body
        //objectet ska vara första objektet
        if(object.length) object=object[0]
        if(req.session.user.worker==true){
            //Ifall det är ens egens objekt
            if(object.userId==req.session.user.id) return next();
            //ifall det man försöker ändra är ett task
            if(object.usertasks){
                if((object.usertasks.filter((x)=>x.user.id==req.session.user.id)).length>0) return next();
            }
        }
        if(object.taskId){
            object = await db.tasks("id",object.taskId)
            if(object.length!=1) throw new Error("more than one task found")
            object = object[0]
        }
        if(object.houseId){
            object = await db.houses("id",object.houseId)
            if(object.length!=1) throw new Error("more than one house found")
            object = object[0]
        }
        if(object.ownerId==undefined && req.beforeOwner!=undefined) object.ownerId=req.beforeOwner
        //Väldigt ful kod för post suggestions
        if(req.session.user.worker==true){
            if((object.userHouses.filter((x)=>x.user.id==req.session.user.id)).length>0){
                if(req.route.path=='/suggestions' && req.route.methods['post']==true) return next();
            }
        }
        if(object.ownerId!=req.session.user.id) throw new Error("You are not the owner")

        
        return next();
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(403)
    }

}

function isUser(req,res,next){
    if(req.session.user.worker!=true) return next();
}

function getHouseId(req,res,next){
    req.beforeOwner=req.session.user.id;
    next()
}







//Debug routes för att skapa user, ska ej finnas egentligen
app.get("/admin",async (req, res)=>{
    try {
        if(((await db.users("worker",false)).length>0)||req.session.user.worker!=true) throw new Error("Det finns redan users")
        res.render("admin");       
    } catch (error){
        return res.render("error",{error:error})
    }
});
//Debug routes för att skapa user, ska ej finnas egentligen
app.post('/admin',async (req, res)=>{
    try {
        if((await db.users("worker",false)).length>0) throw new Error("Det finns redan users")
        user=req.body
        user.password = await bcrypt.hash(user.password,12);    
        user.worker = false
        await db.createUser(user)
        return res.redirect("/");
    } catch (error) {
        return res.render("error",{error:error});
    }
});


//#endregion
