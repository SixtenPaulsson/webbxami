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




//Select * from houses where asd = ?
//con quert("Select * from houses"" , 2)
async function doQuery(query,queryBind=[]){
    let data = await pool.query(query,queryBind);
    if(data.sqlMessage) throw data
    return data;
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

async function mainData(user={id:"",worker:false}){
    try {
        if(user.worker==false){
            const data = await houses("ownerId",user.id)
            if(data.sqlMessage!=undefined) return sqlMessage
            return data
        }
        else{
            let data = await userTasks("userId",user.id)
            console.log("Lista på tasks där userId="+user.id)
            console.log(data)
            if(data.sqlMessage) return data
            if(data.length==0) return []
            const task = []
            for(var i = 0; i < data.length; i++){
                 taskdata = await tasks("id",data[i].taskId)
                 if(taskdata.sqlMessage) return taskdata
                 taskdata=taskdata[0]
                 task[i]=taskdata
            }
            const house = []
            for(var i = 0; i < task.length; i++){
                housedata= await houses("id",task[i].houseId)
                if(housedata.sqlMessage) return housedata
                housedata=housedata[0]
                house[i]=housedata
            }
            return house
        }        
    } catch (error) {
        //console.log(error)
        throw error
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
        //Hämtar ut alla tasks som är kopplade till ett hus
        for(var i = 0; i < data[0].length; i++){
            data[0][i].tasks=await tasks("houseId",data[0][i].id)
        }
        return data[0];
    } catch (error) {
        throw error
    }
}
async function tasks(field="",value=""){
    try {
        const data = await doQuery(queryString("tasks",field)+" ORDER by taskName",[value])
        for(var i = 0; i < data[0].length; i++){
            const usertask=await userTasks("taskId",data[0][i].id)
            data[0][i].usertasks=usertask
        }
        return data[0];
    } catch (error) {
        throw error
    }
}
async function users(field="",value=""){
    try {
        const data = await doQuery((queryString("users",field)+ " order by name"),[value]);
        if(data.sqlMessage) return data
        return data[0]
    } catch (error) {
        throw error
    }
}
async function userTasks(field="",value=""){
    try {
        const data = await doQuery(queryString("usertask",field),[value]);
        if(data[0].length==0) return []
        data[0][0].user = await users("id", data[0][0].userId)
        return data[0]; 
    } catch (error) {
        throw error
    }
}

//#endregion

//#region create
async function createHouse(house){
    try {
        const sql = "INSERT INTO houses (id, ownerId, address, description, price) VALUES (?, ?, ?, ?, ?)";
        return await doQuery(sql,[house.id,house.ownerId,house.address,house.description,house.price])
    } catch (error) {
        throw error
    }
}


async function createTask(task){
    try {
        const sql = "INSERT INTO tasks (id,taskName,houseId, procent) VALUES (?, ?, ?,?)";
        return await doQuery(sql,[task.id,task.taskName,task.houseId,task.procent]);
    } catch (error) {
        throw error
    }
}
async function createUser(user){
    try {
        const sql = "INSERT INTO users (id, worker, name, password) VALUES (?, ?, ?, ?)"; 
        return await doQuery(sql,[user.id, user.worker,user.name, user.password]);
    } catch (error) {
        throw error
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
        throw error
    }
}
//#endregion

//#region update
async function update(table,object,id){
    console.log("start av upddate")
    try {
        //Sql strängen kommer tillslut bli hela update queryn
        let sql = "Update "
        //Dictinary/array över alla acceptabla värden, man ska inte kunna ändra id
        tableFields = {
            "houses":["ownerId","address","description","price"],
            "tasks":["taskName","procent"],
            "users":["worker","name","password"]
        }
        //Queryn ska bara kunna uppdatera de tables som finns
        if(tableFields[table]!=undefined) sql+=table+" SET "
        //Slänger på de acceptabla fälten som ska uppdateras
        for (var i = 0; i < object.length; i++){
            if(tableFields[table].includes(object[i].field)) sql+=(object[i].field+" = (?), ");
        }
        //Tar bort det sista komma tecknet och lägger på mer text
        sql = sql.slice(0,-2)+" WHERE id= ?;";
        //Hämtar ut varje fälts värde
        let valueArr = object.map(e=>e.value);
        //Lägger till så att id't blir använt i queryn
        valueArr.push(id)
        //Gör en query
        return await doQuery(sql,valueArr);
    } catch (error) {
        throw error
    }
}
//#endregion
//#region delete
async function deleteHouse(id){
    try {
        const sql = "DELETE FROM houses WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        throw error
    }
}
async function deleteTask(id){
    try {
        const sql = "DELETE FROM tasks WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        throw error
    }
}
async function deleteUser(id){
    try {
        const sql = "DELETE FROM users WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        throw error
    }
}
async function deleteUserTask(id){
    try {
        const sql = "DELETE FROM usertask WHERE id = ?";
        return await doQuery(sql,[id]); 
    } catch (error) {
        throw error
    }
}
//#endregion



//Exporterar
module.exports = {createHouse,houses,deleteHouse,
                  createTask, tasks, deleteTask,
                  createUser, users, deleteUser,
                  createUserTask,userTasks,deleteUserTask,
                  mainData,update};