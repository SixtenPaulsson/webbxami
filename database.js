const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    //Kontots lösenord
    password:"",
    //Portnummret
    port:3306,
    //Namnet på databasen
    database:"webbxami"
});

async function doQuery(query,queryBind=[]){
    try {
        //Gör en connection
        const con = await pool.getConnection()
        let data = await con.query(query,queryBind);
        //console.log(data)
        pool.releaseConnection(con);
        return data[0] 
    } catch (error) {
        return {error,err:"gick fel"}
    }
}
//#region read

//Alla de fyra funktionerna här returnar all data från tabellerna
//Ifall man fyller i "field" och "value" kommer den -
//- returna alla objekt från tabellen som har samma value i ett specifikt fält
//
async function houses(field="",value=""){
    try {
        const sql=queryString("houses",field)+" ORDER by address"
        const data = await doQuery(sql,[value])
        for(var i = 0; i < data.length; i++){
            data[i].tasks=await doQuery(queryString("tasks","houseId"),data[i].id)
        }
        return data;
    } catch (error) {
        console.log("Gick fel")
    }
}
async function tasks(field="",value=""){
    try {
        const sql=queryString("tasks",field)+" ORDER by taskName"
        const data = await doQuery(sql,[value])
        for(var i = 0; i < data.length; i++){
            data[i].usertask=await doQuery(queryString("usertask","taskId"),data[i].id)
        }
        return data;
    } catch (error) {
        return error
    }
}
async function users(field="",value=""){
    try {
        return await doQuery((queryString("users",field)+ " order by name"),[value]);
    } catch (error) {
        return error
    }
}
async function userTasks(field="",value=""){
    try {
        const sql=queryString("usertask",field)+ " order by id"
        const data = await doQuery(sql,[value]);
        data.user=await doQuery(queryString("users","id"),data[i].id)
        return data; 
    } catch (error) {
        return error
    }
}

//#endregion

//#region create
async function createHouse(house){
    try {
        const sql = "INSERT INTO houses (id, ownerId, address, description, price) VALUES (?, ?, ?, ?, ?)";
        return await doQuery(sql,[house.id,house.ownerId,house.address,house.description,house.price]).insertId
    } catch (error) {
        return error
    }
}
async function createTask(task){
    try {
        const sql = "INSERT INTO tasks (id,taskName,houseId, procent) VALUES (?, ?, ?,?)";
        return await doQuery(sql,[task.id,task.taskName,task.houseId,task.procent]);
    } catch (error) {
        return error
    }
}
async function createUser(user){
    try {
        const sql = "INSERT INTO users (id, worker, name, password) VALUES (?, ?, ?, ?)"; 
        return await doQuery(sql,[user.id, user.worker,user.name, user.password]);
    } catch (error) {
        return error
    }
}
async function createUserTask(userTask){
    try {
        const prev = await doQuery("select * from usertask where userId=? AND taskId=?",[userTask.userId,userTask.taskId])
        if(prev[0].length!=0){
            const sql = "INSERT INTO usertask (userId, taskId, id) VALUES (?, ?, ?)"; 
            return await doQuery(sql,[userTask.userId, userTask.taskId, userTask.id]);
        }
        return "Personen är redan med"
    } catch (error) {
        return error
    }
}
//#endregion

//#region update
async function updateHouse(id,house){
    try {
        let sql = "Update houses SET address=(?),ownerId=(?), description=(?),price=(?) WHERE id=(?)"
        return await doQuery(sql,[house.address,house.ownerId,house.description,house.price,id]);
    } catch (error) {
        console.log("Gick fel")
    }
}
async function updateTask(id,task){
    try {
        let sql = "Update tasks SET id=(?),taskName=(?), task=(?),procent=(?) WHERE id=(?)"
        return await doQuery(sql,[task.id,task.taskName,task.houseId,task.procent,id]);
    } catch (error) {
        console.log("Gick fel")
    }
}
async function updateUser(id,user){
    try {
        let sql = "Update users SET id=(?), worker=(?),name=(?),password=(?) WHERE id=(?)"
        return await doQuery(sql,[user.id, user.worker,user.name, user.password,id]);
    } catch (error) {
        console.log("Gick fel")
    }
}
async function updateUserTasks(id,userTask){
    try {
        let sql = "Update usertask SET userId=(?), taskId=(?),id=(?) WHERE id=(?)"
        return await doQuery(sql,[userTask.userId,userTask.taskId,userTask.id,id]);
    } catch (error) {
        console.log("Gick fel")
    }
}
//#endregion
//#region delete
async function deleteHouse(id){
    try {
        const sql = "DELETE FROM houses WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        return error
    }
}
async function deleteTask(id){
    try {
        const sql = "DELETE FROM tasks WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        return error
    }
}
async function deleteUser(id){
    try {
        const sql = "DELETE FROM users WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        return error
    }
}
async function deleteUserTask(id){
    try {
        const sql = "DELETE FROM usertask WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        return error
    }
}
//#endregion


async function login(name,password){
    
    try {
        data = await doQuery(queryString("users","name"),[name])
        if(data.length==1 && data[0].password==password){
            return data
        }
        return "fel namn eller lösenord"
    } catch (error) {
        return error
    }
    
    
    try {
        const con = await pool.getConnection()
        
        //Sql query
        
        let sql = "SELECT * FROM users WHERE name=(?)"

        //Skickar frågan
        let data = await con.query(sql,[name]);
        pool.releaseConnection(con);
        
        console.log("hej")
        console.log(data[0])
        console.log(data[0][0].name,data[0][0].password,password)
        if(data[0][0].password==password){
            return data[0];
        }
        return "not right"
        //Releasar connection 
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}
//Jävligt ful funktion med med tanke på antalet case satser men jag kände att det här var nödvändigt
//För att kunna undvika sql injections samt fulare kod på select * from funktionerna längre upp
function queryString(table,field){

    //Funktion för att få fram querysträngen för ett typiskt "select * from sak where sak = sak"
    //select * from ? where ? = ? funkar ej 
    switch(table){
        case 'houses':
            switch(field){
                case 'id':
                    return "select * from houses where id=?"
                case 'ownerId':
                    return "select * from houses where ownerId=?"
                case 'address':
                    return "select * from houses where address=?"
                case 'description':
                    return "select * from houses where description=?"
                case 'price':
                    return "select * from houses where price=?"
                case '':
                    return "select * from houses"
            }
        case 'tasks':
            switch(field){
                case 'id':
                    return "select * from tasks where id=?"
                case 'taskName':
                    return "select * from tasks where taskName=?"
                case 'houseId':
                    return "select * from tasks where houseId=?"
                case 'procent':
                    return "select * from tasks where procent=?"
                case '':
                    return "select * from tasks"
            }
    
        case 'users':
            switch(field){
                case 'id':
                    return "select * from users where id=?"
                case 'worker':
                    return "select * from users where taskName=?"
                case 'name':
                    return "select * from users where name=?"
                case 'password':
                    return "select * from users where password=?"
                case '':
                case '*':
                    return "select * from users"
            }
        case 'usertask':
            switch(field){
                case 'userId':
                    return "select * from usertask where userId=?"
                case 'taskId':
                    return "select * from usertask where taskId=?"
                case 'id':
                    return "select * from usertask where id=?"
                case '':
                case '*':
                    return "select * from usertask"
            }
        default:
            return "fel"
    }
}
//Exporterar
module.exports = {createHouse,houses,updateHouse,deleteHouse,
                  createTask, tasks, updateTask, deleteTask,
                  createUser, users, updateUser, deleteUser,
                  createUserTask,userTasks,updateUserTasks,deleteUserTask,
                  login,users};