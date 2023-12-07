const fs = require("fs");

module.exports= {saveToFile, getAllData};

function saveToFile(data,fileName = "guitars.json"){
    fs.writeFile(fileName, JSON.stringify(data, null, 2),function(err){
        if(err) console.log(err)
    });
}

function getAllData(fileName = "guitars.json"){
    
    return new Promise(function(resolve, reject){
        
        try{
            fs.readFile(fileName,function(err,data){

                if(err) return reject(err);

                resolve(JSON.parse(data));

            });
        } catch(error){
            reject(error);
        }

    });
}
