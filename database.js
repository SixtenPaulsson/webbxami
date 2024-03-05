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
    //Log
    console.log(result);
    //Release connection
    pool.releaseConnection(con);
    //return result[0].insertId;
}



async function houses(id=""){
    try {
        console.log("hej123")
        const con = await pool.getConnection()
        
        //Sql query
        
        let sql = "SELECT * FROM houses ORDER BY address DESC"
        //Skickar frågan
        let data = await con.query(sql);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        console.log(data[0])
        return data[0];
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}


async function tasks(){
    try {
        console.log("hej123")
        const con = await pool.getConnection()
        //Sql query
        const sql = "SELECT * FROM houses ORDER BY address DESC"
        //Skickar frågan
        let data = await con.query(sql);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
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
        let data = await con.query(sql,[house.address,house.description,house.price]);
        //Releasar connection
        pool.releaseConnection(con);
        //Returnar hus
        console.log(data[0])
        return data[0];
    } catch (error) {
        console.log("Gick fel")
    }

    //Skapar connection
    
}



//Exporterar
module.exports = {createHouse,houses,deleteHouse,updateHouse};