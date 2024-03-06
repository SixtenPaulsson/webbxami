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

//Create house funktion
async function createHouse(house){
    console.log(house)
    //Skapar connection
    const con = await pool.getConnection();
    //Sql query
    const sql = "INSERT INTO houses (id,address, description, price) VALUES (?, ?, ?, ?)";
    //Resultatet av queryn   
    const result = await con.query(sql,[house.id,house.address,house.description,house.price]);
    
    
    
    console.log(result);
    
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

    const sql2 = "DELETE FROM tasks WHERE houseId = (?)";
    //Skickar frågan / binar värden
    const result2 = await con.query(sql,[id]);

    //Log
    console.log(result,result2);
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
            console.log(taskImport)
            data[0][i].tasks=taskImport
        }
        console.log(data[0])


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
        let sql = "Update houses SET address=(?), description=(?),price=(?) WHERE id=(?)"
        //Skickar frågan
        let data = await con.query(sql,[house.address,house.description,house.price,id]);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        console.log(data[0])
        return data[0];
    } catch (error) {
        console.log("Gick fel")
    }
}

async function tasks(houseId=""){
    try {
        console.log("Försöker hämta tasks")
        const con = await pool.getConnection()
        //Sql query
        if(houseId==""){
            const sql = "SELECT * FROM tasks ORDER BY taskName DESC"
        //Skickar frågan
        let data = await con.query(sql);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        console.log(data[0])
        return data[0];
        }
        else{
            const sql = "SELECT * FROM tasks where houseId=(?) ORDER BY taskName DESC"
            //Skickar frågan
            let data = await con.query(sql,[houseId]);
            //Releasar connection
            pool.releaseConnection(con);
            //Returnar hus
            console.log(data[0])
            return data[0];
        }

        
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}



async function createTask(task){
    console.log(task)
    //Skapar connection
    const con = await pool.getConnection();
    //Sql query
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
    //Skapar connection
    const con = await pool.getConnection();
    //Sql query
    const sql = "DELETE FROM tasks WHERE ID = (?)";
    //Skickar frågan / binar värden
    const result = await con.query(sql,[id]);
    //Log
    console.log(result);
    //Release connection
    pool.releaseConnection(con);
    //return result[0].insertId;
}







//Exporterar
module.exports = {createHouse,houses,deleteHouse,updateHouse,tasks,createTask,deleteTask};