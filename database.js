const mysql = require("mysql2/promise");
const uniqid = require("uniqid");
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
    const fields = {
        "houses":["id","ownerId","address","description","price"],
        "tasks":["id","taskName","procent","houseId"],
        "users":["id","worker","name","password"],
        "usertask":["id","userId","taskId"]
    }
    if(fields[table]==undefined) throw new Error("Table for query is not valid")
    if(field==""  || !fields[table].includes(field)) throw new Error("Field is not valid")
    const sql = "SELECT * FROM "+ table +" WHERE "+ field +" = ?"
    console.log(sql)
    return sql
}

async function mainData(user={id:"",worker:false}){
    if(user.worker==false){
        const data = await houses("ownerId",user.id)
        return data
    }
    const data = await userTasks("userId",user.id)
    if(data.length==0) return []
    const task = []
    for(var i = 0; i < data.length; i++){
        let taskdata = await tasks("id",data[i].taskId)
        taskdata=taskdata[0]
        task[i]=taskdata
    }
    const house = []
    for(var i = 0; i < task.length; i++){
        let housedata = await houses("id",task[i].houseId)
        housedata=housedata[0]
        house[i]=housedata
        house[i].tasks = house[i].tasks.filter((x)=>x.usertasks.filter((y)=>y.userId==user.id).length>0);
    }
    return house
      
}


//#region read

//Alla de fyra funktionerna här returnar all data från tabellerna
//Ifall man fyller i "field" och "value" kommer den -
//- returna alla objekt från tabellen som har samma value i ett specifikt fält
//

async function houses(field="",value=""){
    const sql=queryString("houses",field)+" ORDER by address"
    const data = await doQuery(sql,[value])
    //Hämtar ut alla tasks som är kopplade till ett hus
    for(var i = 0; i < data[0].length; i++){
        data[0][i].tasks=await tasks("houseId",data[0][i].id)
    }
    return data[0];
}
async function tasks(field="",value=""){
    const data = await doQuery(queryString("tasks",field)+" ORDER by taskName",[value])
    for(var i = 0; i < data[0].length; i++){
        const usertask=await userTasks("taskId",data[0][i].id)
        data[0][i].usertasks=usertask
    }
    return data[0];
}
async function users(field="",value=""){
    const data = await doQuery((queryString("users",field)+ " order by name"),[value]);
    return data[0]
}
async function userTasks(field="",value=""){
    const data = await doQuery(queryString("usertask",field),[value]);
    if(data[0].length==0) return []
    data[0][0].user = await users("id", data[0][0].userId)
    return data[0]; 
}

//#endregion

//#region create
async function createHouse(house){
    const sql = "INSERT INTO houses (id, ownerId, address, description, price) VALUES (?, ?, ?, ?, ?)";
    return await doQuery(sql,[uniqid(),house.ownerId,house.address,house.description,house.price]);
}


async function createTask(task){
    const sql = "INSERT INTO tasks (id,taskName,houseId, procent) VALUES (?, ?, ?,?)";
    return await doQuery(sql,[uniqid(),task.taskName,task.houseId,task.procent]);
}
async function createUser(user){
    const sql = "INSERT INTO users (id, worker, name, password) VALUES (?, ?, ?, ?)"; 
    return await doQuery(sql,[uniqid(), user.worker,user.name, user.password]);
}
async function createUserTask(userTask){
    const prev = await doQuery("select * from usertask where userId= ? AND taskId= ?",[userTask.userId,userTask.taskId])
    if(prev[0].length!=0) throw new Error("Personen är redan med")
    const sql = "INSERT INTO usertask (userId, taskId, id) VALUES (?, ?, ?)"; 
    return await doQuery(sql,[userTask.userId, userTask.taskId, uniqid()]);
}
//#endregion
//Väldigt flexibel update funktion
async function update(table,object=[],id){
    //Table är vilken tabell som ska updateras
    //object är en array på vilka fält och värden som ska uppdateras,
    //Id är vilken den ska uppdatera
    //Ett typiskt object som skickas in kan se ut så här:
    //[
    // {field:"address",value:"annan address"},
    // {field:"price"  ,value:"300"}
    //]
    
    //Dictinary/array över alla acceptabla värden, man ska inte kunna ändra id
    tableFields = {
        "houses":["ownerId","address","description","price"],
        "tasks":["taskName","procent"],
        "users":["worker","name","password"]
    }
    //Queryn ska bara kunna uppdatera de tables som finns
    if(tableFields[table]==undefined) throw new Error("Table is not valid")
    //Tar bort alla object som där field och value är odefinerade
    object = object.filter((x)=>x.field!=undefined && x.value!=undefined &&x.value!="");  
    if(object.length==0) throw new Error("No valid update values/fields");
    

    //Slänger på de acceptabla fälten som ska uppdateras
    let where = ""
    for (var i = 0; i < object.length; i++){
        if(tableFields[table].includes(object[i].field)) where+=(object[i].field+" = (?), ");
    }
    let sql = "Update "+table+" SET "+where;
    //Tar bort det sista komma tecknet och lägger på mer text
    sql=sql.slice(0,-2)+" WHERE id= ?;";
    //Hämtar ut varje fälts värde
    let valueArr = object.map(e=>e.value);
    //Lägger till så att id't blir använt i queryn
    valueArr.push(id)
    //Gör en query
    return await doQuery(sql,valueArr);
}

//Flexibel delete funktion, tar bort från en viss tabell där id't är lika med något
//Borde heta delete men javascript är jobbigt
async function remove(table, id){
    validTables = ["houses","tasks","users","userTask"]    
    if(!validTables.includes(table)) throw new Error("Not valid table");
    const sql = "DELETE FROM "+table+" WHERE id = ?";
    return await doQuery(sql,[id]); 
}
//Exporterar
module.exports = {createHouse,houses,
                  createTask, tasks,
                  createUser, users,
                  createUserTask,userTasks,
                  mainData,update,remove};