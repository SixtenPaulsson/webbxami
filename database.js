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
        
        const con = await pool.getConnection()
                
        //console.log(query)
        let data = await con.query(query,queryBind);
        pool.releaseConnection(con);
        return data
    } catch (error) {
        console.log(pool)
        return error
    }
}

function queryString(table,field=""){
    let sql = "SELECT * FROM "
    const tables = ["houses","tasks","usertask","users"]
    if(tables.includes(table)) sql+=table
    if(field!=""){
        const fields = ["id","ownerId","address","description","price",
                        "taskName","houseId","procent",
                        "worker","name","password",
                        "userId","taskId"]
        if(fields.includes(field)) sql+=" WHERE "+field+" = ?"
    }
    return sql
}

async function mainData(user){
    try {
        if(user==undefined) return []
        if(user.worker==false){
            const data = await houses("ownerId",user.id)
            if(data.sqlmessage!=undefined) return sqlmessage
            return data
        }
        else{
            let data = await userTasks("userId",user.id)
            
            console.log("before")
            console.log(data)
            if(data.sqlmessage) return sqlmessage
            if(data.length==0) return []
            const task = []
            for(var i = 0; i < data.length; i++){
                task[i] = await tasks("id",data[i].taskId)
            }
            if(task==undefined) return []
            const house = []
            for(var i = 0; i < task.length; i++){
                house[i] = await houses("id",task[0][i].houseId)
            }
            console.log(house)
            console.log("hej")
            if(house==undefined) return []
            return house[0]
        }        
    } catch (error) {
        return error
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
        for(var i = 0; i < data[0].length; i++){
            data[0][i].tasks=await tasks("houseId",data[0][i].id)
        }
        return data[0];
    } catch (error) {
        return error
    }
}
async function tasks(field="",value=""){
    try {
        const data = await doQuery(queryString("tasks",field)+" ORDER by taskName",[value])
        for(var i = 0; i < data[0].length; i++){
            usertask=await userTasks("taskId",data[0][i].id)
            data[0][i].usertasks=usertask
        }
        return data[0];
    } catch (error) {
        return error
    }
}
async function users(field="",value=""){
    try {
        const data = await doQuery((queryString("users",field)+ " order by name"),[value]);
        return data[0]
    } catch (error) {
        return error
    }
}
async function userTasks(field="",value=""){
    try {
        const data = await doQuery(queryString("usertask",field),[value]);
        
        if(data[0].length==0) return []
        data[0][0].user = await users("id", data[0][0].userId)
        return data[0]; 
    } catch (error) {
        return error
    }
}

//#endregion

//#region create
async function createHouse(house){
    try {
        const sql = "INSERT INTO houses (id, ownerId, address, description, price) VALUES (?, ?, ?, ?, ?)";
        return await doQuery(sql,[house.id,house.ownerId,house.address,house.description,house.price])
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
        const prev = await doQuery("select * from usertask where userId= ? AND taskId= ?",[userTask.userId,userTask.taskId])
        if(prev[0].length==0){
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
        return error
    }
}
async function updateTask(id,task){
    try {
        let sql = "Update tasks SET id=(?),taskName=(?), task=(?),procent=(?) WHERE id=(?)"
        return await doQuery(sql,[task.id,task.taskName,task.houseId,task.procent,id]);
    } catch (error) {
        return error
    }
}
async function updateUser(id,user){
    try {
        let sql = "Update users SET id=(?), worker=(?),name=(?),password=(?) WHERE id=(?)"
        return await doQuery(sql,[user.id, user.worker,user.name, user.password,id]);
    } catch (error) {
        return error
    }
}
async function updateUserTasks(id,userTask){
    try {
        let sql = "Update usertask SET userId=(?), taskId=(?),id=(?) WHERE id=(?)"
        return await doQuery(sql,[userTask.userId,userTask.taskId,userTask.id,id]);
    } catch (error) {
        return error
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
        data = await doQuery(queryString("users","name")+" AND password=?",[name,password])
        if(data[0].length==1) return data[0]
        return "fel namn eller lösenord"
    } catch (error) {
        return error
    }

    
}
//returnar "select * from ? where ? = ? beroende på vad man inputtar 

//Exporterar
module.exports = {createHouse,houses,updateHouse,deleteHouse,
                  createTask, tasks, updateTask, deleteTask,
                  createUser, users, updateUser, deleteUser,
                  createUserTask,userTasks,updateUserTasks,deleteUserTask,
                  login,users,mainData};