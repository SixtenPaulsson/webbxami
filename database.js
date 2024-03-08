//Imports

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

//#region house
//Create house funktion
async function createHouse(house){
    //console.log(house)
    //Skapar connection
    const con = await pool.getConnection();
    //Sql query
    const sql = "INSERT INTO houses (id, ownerId, address, description, price) VALUES (?, ?, ?, ?, ?)";
    //Resultatet av queryn   
    const result = await con.query(sql,[house.id,house.ownerId,house.address,house.description,house.price]);
    
    
    
    //console.log(result);
    
    //Avslutar connectionen
    pool.releaseConnection(con);
    //Returnar delen av resultatet
    return result[0].insertId;
}

//Delete funktionen
async function deleteHouse(id){
    //Skapar connection
    const con = await pool.getConnection();
    //Sql query
    const sql = "DELETE FROM houses WHERE ID = (?)";
    //Skickar frågan / binar värden
    const result = await con.query(sql,[id]);
    //Log
    //console.log(result,result2);
    //Release connection
    pool.releaseConnection(con);
    return result[0];
}

async function houses(id=""){
    try {
        const con = await pool.getConnection()
        
        //Sql query
        
        let sql = "SELECT * FROM houses ORDER BY address DESC"
        //Skickar frågan
        let data = await con.query(sql);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        //console.log(data[0])
        
        //data[0][0].tasks=await tasks(data[0][i].id)

        for(var i = 0; i < data[0].length; i++){

            taskImport=await tasks(data[0][i].id)
            //console.log(taskImport)
            data[0][i].tasks=taskImport
        }
        //console.log(data[0])


        return data[0];
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}

async function updateHouse(id,house){
    try {
        const con = await pool.getConnection()
        
        //Sql query
        let sql = "Update houses SET address=(?),ownerId=(?), description=(?),price=(?) WHERE id=(?)"
        //Skickar frågan
        let data = await con.query(sql,[house.address,house.ownerId,house.description,house.price,id]);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        //console.log(data[0])
        return data[0];
    } catch (error) {
        console.log("Gick fel")
    }
}
//#endregion
//#region task
async function tasks(houseId=""){
    try {
        //console.log("Försöker hämta tasks")
        const con = await pool.getConnection()
        //Sql query
        if(houseId==""){
            const sql = "SELECT * FROM tasks ORDER BY taskName DESC"
            let data = await con.query(sql);

            for(var i = 0; i < data[0].length; i++){

                taskImport=await userFromTask(data[0][i].id)
                //console.log(taskImport)
                data[0][i].tasks=taskImport
            }

            pool.releaseConnection(con);
            return data[0];
        }
        else{
            const sql = "SELECT * FROM tasks where houseId=(?) ORDER BY taskName DESC"
            let data = await con.query(sql,[houseId]);



            pool.releaseConnection(con);
            return data[0];
        }
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}

async function createTask(task){
    const con = await pool.getConnection();
    const sql = "INSERT INTO tasks (id,taskName,houseId, procent) VALUES (?, ?, ?,?)";
    //Resultatet av queryn   
    const result = await con.query(sql,[task.id,task.taskName,task.houseId,task.procent]);
    console.log(result);
    
    //Avslutar connectionen
    pool.releaseConnection(con);
    //Returnar delen av resultatet
    return result[0].insertId;
}

async function deleteTask(id){
    const con = await pool.getConnection();
    const sql = "DELETE FROM tasks WHERE ID = (?)";
    
    const result = await con.query(sql,[id]);
    console.log(result);

    pool.releaseConnection(con);
    //return result[0].insertId;
}



//#endregion
//#region users
async function createUser(user){

    const con = await pool.getConnection();
    const sql = "INSERT INTO users (id, worker, name, password) VALUES (?, ?, ?, ?)"; 
    const result = await con.query(sql,[user.id, user.worker,user.name, user.password]);
    
    
    
    console.log(result);
    
    //Avslutar connectionen
    pool.releaseConnection(con);
    //Returnar delen av resultatet
    return result[0].insertId;
}
//#endregion
//#region userTasks

//#endregion



//Delete funktionen




async function users(id=""){
    try {
        const con = await pool.getConnection()
        
        //Sql query
        if(id=""){
            let sql = "SELECT * FROM users ORDER BY name DESC"
            let data = await con.query(sql);
            pool.releaseConnection(con);
            return data[0];
        }
        else{
            let sql = "SELECT * FROM users where id=(?)"
            let data = await con.query(sql,[id]);
            pool.releaseConnection(con);
            return data[0];
        }
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}



async function updateUser(id,user){
    try {
        const con = await pool.getConnection()
        
        //Sql query
        let sql = "Update users SET id=(?), name=(?),password=(?),relations=(?) WHERE id=(?)"
        //Skickar frågan
        let data = await con.query(sql,[user.id,user.name, user.password, user.relations]);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        //console.log(data[0])
        return data[0];
    } catch (error) {
        console.log("Gick fel")
    }
}

async function deleteUser(id){
    //Skapar connection
    const con = await pool.getConnection();
    //Sql query
    const sql = "DELETE FROM users WHERE ID = (?)";
    //Skickar frågan / binar värden
    const result = await con.query(sql,[id]);


    //Log
    //console.log(result,result2);
    //Release connection
    pool.releaseConnection(con);
    return result[0];
}

async function login(name,password){
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


async function userFromTask(taskId=""){
    try {
        //console.log("Försöker hämta tasks")
        const con = await pool.getConnection()
        if(taskId==""){
            const sql = "SELECT * FROM usertask ORDER BY userId DESC"
            let data = await con.query(sql);
            for(var i = 0; i < data[0].length; i++){

                userImport=await users(data[0][i].userId)
                //console.log(taskImport)
                data[0][i].user=userImport
            }
            pool.releaseConnection(con);
            return data[0];
        }
        
        else{
            const sql = "SELECT * FROM usertask where taskId=(?) order BY taskId"
            let data = await con.query(sql,[taskId]);
            for(var i = 0; i < data[0].length; i++){

                userImport=await users(data[0][i].userId)
                //console.log(taskImport)
                data[0][i].user=userImport
            }
            pool.releaseConnection(con);
            return data[0];
        }
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}

//Create
//Createhouse
//Create task
//Create user
//Create usertask

//Read
//houses
//users
//tasks
//usertasks


//Update
//Update house
//Update task
//Update user
//update usertask


//Delete
//deleteHouse
//DeleteTask
//DeleteUser
//DeleteUserTask





//Logout
//Login


async function createUserTask(userTask){

}

async function userTasks(id=""){

}

async function updateUserTasks(id,userTask){
    
}

async function deleteUserTask(id){

}


//Exporterar





module.exports = {createHouse,houses,updateHouse,deleteHouse,
                  createTask, tasks, deleteTask, deleteTask,
                  createUser, users, updateUser, deleteUser,
                  createUserTask,userTasks,updateUserTasks,deleteUserTask,
                  login,users};