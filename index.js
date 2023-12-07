const express = require("express");
const {log, auth} = require("./mw");
const {guitars} = require("./controllers");

const app = express();

app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("lyssnar på 3456");   
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

let user = "user";

app.get("/guitars",log, guitars.index);
app.post("/guitars", guitars.create);
app.get("/guitars/:id",log, auth(user), guitars.show);
app.delete("/guitars/:id", guitars.destroy);
app.put("/guitars/:id", guitars.update);


//Auth routes

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.post("/login",login);
app.post("/verify",verify);




