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
    const data = await pool.query(query,queryBind);
    //När ett fel uppstår så kommer det finnas med ett sqlmeddelande i objektet
    if(data.sqlMessage) throw data
    return data;

}
//Funktion som returnerar en "select from" sats
function queryString(table,field=""){
    //Lista på alla tables samt deras fields
    const fields = {
        "houses":["id","ownerId","address","description","price"],
        "tasks":["id","taskName","procent","houseId"],
        "users":["id","worker","name","password"],
        "workertask":["id","userId","taskId"],
        "workerhouse":["id","userId","houseId"],
        "suggestions":["id","text","houseId","userId","date","description"],
        "comments":["id","text","taskId","userId","date","description"]
    }
    //Ifall inte tablet finns
    if(!(table in fields)) throw new Error("Table for query is not valid")
    let sql = "SELECT * FROM "+ table
    //Ifall man vill ha med en "WHERE x = ?" i queryn
    if(field != ""){
        //Ifall inte fieldet man ska kolla efter finns
        if(!fields[table].includes(field)) throw new Error("Field is not valid")
        sql += " WHERE "+ field +" = ?"
    }
    return sql
}



async function mainData(user={id:"",worker:false}){
    if(user.worker==false){
        const data = await houses("ownerId",user.id)
        return data
    }
    const data = await doQuery("select * from houses where id = (SELECT houseId from workerhouse WHERE userId = ?)",[user.id]);
    //Denna loopen kanske verkar vara helt redundant men här hämtas även tasks och sånt
    for(var i = 0; i < data[0].length; i++){ 
        const house = await houses("id",data[0][i].id)
        data[0][i] = house[0]
        data[0][i].tasks = data[0][i].tasks.filter((x)=>x.workertasks.filter((y)=>y.userId==user.id).length>0);
    }
    return data[0]
}


//#region read

//Alla de fyra funktionerna här returnar all data från tabellerna
//Ifall man fyller i "field" och "value" kommer den -
//- returna alla objekt från tabellen som har samma value i ett specifikt fält
//





async function houses(field="",value=""){
    const sql = queryString("houses",field)+" ORDER by address"
    const data = await doQuery(sql,[value])
    //Hämtar ut alla tasks som är kopplade till ett hus
    for(var i = 0; i < data[0].length; i++){
        data[0][i].tasks = await tasks("houseId",data[0][i].id)
        data[0][i].workerHouses = await workerHouse("houseId",data[0][i].id)
        data[0][i].suggestions = await suggestions("houseId",data[0][i].id);
    }
    return data[0];
} 
async function suggestions(field="",value=""){
    const data = await doQuery(queryString("suggestions",field)+" ORDER by text",[value])
    for(var i = 0; i < data[0].length; i++){
        const user=await users("id",data[0][i].userId)
        if(user.length==1) data[0][i].user=user[0]
        //Ska egentligen inte kunna hända
        //det finns en trigger som tar bort de suggestions utan users
        else{
            data[0][i].user = {name: "user not found"}
        }
    }
    return data[0];
}
async function comments(field="",value=""){
    const data = await doQuery(queryString("comments",field)+" ORDER by date",[value])
    for(var i = 0; i < data[0].length; i++){
        const user=await users("id",data[0][i].userId)
        if(user.length==1) data[0][i].user=user[0]
        else{
            data[0][i].user = {name: "user not found"}
        }
    }
    return data[0];
}




async function tasks(field="",value=""){
    const data = await doQuery(queryString("tasks",field)+" ORDER by taskName",[value])
    for(var i = 0; i < data[0].length; i++){
        data[0][i].workertasks=await workerTasks("taskId",data[0][i].id)
        data[0][i].comments=await comments("taskId",data[0][i].id)
    }
    return data[0];
}

async function users(field="",value=""){
    const data = await doQuery((queryString("users",field)+ " order by name"),[value]);
    return data[0]
}
async function workerTasks(field="",value=""){
    const data = await doQuery(queryString("workertask",field),[value]);
    for(var i = 0; i < data[0].length; i++){
        const user =await users("id", data[0][i].userId)
        if(user.length==1) data[0][i].user = user[0]
    }
    return data[0]; 
}
async function workerHouse(field="",value=""){
    const data = await doQuery(queryString("workerhouse",field),[value]);
    for(var i = 0; i < data[0].length; i++){
        const user =await users("id", data[0][i].userId)
        if(user.length==1) data[0][i].user = user[0]
    }
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
async function createSuggestion(suggestion){
    const sql = "INSERT INTO suggestions (id, text, description, houseId, userId) VALUES (?, ?, ?, ?, ?)"; 
    return await doQuery(sql,[uniqid(),suggestion.text,suggestion.description,suggestion.houseId,suggestion.userId]);
}

async function createComment(comment){
    const sql = "INSERT INTO comments (id, text, description, taskId, userId) VALUES (?, ?, ?, ?, ?)"; 
    return await doQuery(sql,[uniqid(),comment.text,comment.description,comment.taskId,comment.userId]);
}

async function createUser(user){
    const sql = "INSERT INTO users (id, worker, name, password) VALUES (?, ?, ?, ?)"; 
    return await doQuery(sql,[uniqid(), user.worker,user.name, user.password]);
}
async function createWorkerTask(workerTask){
    const prev = await doQuery("select * from workertask where userId= ? AND taskId= ?",[workerTask.userId,workerTask.taskId])
    if(prev[0].length!=0) throw new Error("Personen är redan med i tasket")
    const sql = "INSERT INTO workertask (userId, taskId, id) VALUES (?, ?, ?)"; 
    let result = await doQuery(sql,[workerTask.userId, workerTask.taskId, uniqid()]);
    if((await workerHouse("userId",workerTask.userId)).length==0) await createWorkerHouse(workerTask)
    return result
}

async function createWorkerHouse(workerHouse){
    const prev = await doQuery("select * from workerhouse where userId= ? AND houseId= ?",[workerHouse.userId,workerHouse.houseId])
    if(prev[0].length!=0) throw new Error("Personen är redan med i huset")
    const sql = "INSERT INTO workerhouse (userId, houseId, id) VALUES (?, ?, ?)";
    return await doQuery(sql,[workerHouse.userId, workerHouse.houseId, uniqid()]);
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
    // {field:"asdashlfdkdkfhsdlkhf"  ,value:"300"}
    //]
    
    //Dictinary/array över alla acceptabla värden, man ska inte kunna ändra id
    const tableFields = {
        "houses":["ownerId","address","description","price"],
        "tasks":["taskName","procent"],
        "users":["worker","name","password"],
        "suggestions":["text","description"],
        "comments":["text","description"]
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
    const validTables = ["houses","tasks","users","workerTask","workerHouse","suggestions",'comments']    
    if(!validTables.includes(table)) throw new Error("Not valid table");
    const sql = "DELETE FROM "+table+" WHERE id = ?";
    return await doQuery(sql,[id]); 
}

//Riktig fullösning för att få ut ett objekt från ett id
//Ska vara typ som en (select * from allTables where id = ?) men det funkade inte
async function getObjectFromId(id)
{
    let obj=await houses("id",id)
    if(obj.length>0) return obj[0]
    obj=await tasks("id",id)
    if(obj.length>0) return obj[0]
    obj=await workerHouse("id",id)
    if(obj.length>0) return obj[0]
    obj=await workerTasks("id",id)
    if(obj.length>0) return obj[0]
    obj=await suggestions("id",id)
    if(obj.length>0) return obj[0]
    obj=await comments("id",id)
    if(obj.length>0) return obj[0]
}





async function getHouse(object){
    if(object.taskId)object = (await tasks("id",object.taskId))[0]
    if(object.houseId)object = (await houses("id",object.houseId))[0]
    return object
}



//Exporterar
module.exports = {createHouse,houses,
                  createTask, tasks,
                  createUser, users,
                  createSuggestion,suggestions,
                  createComment,comments,
                  createWorkerTask,workerTasks,
                  createWorkerHouse,workerHouse,
                  mainData,update,remove,getObjectFromId,getHouse};