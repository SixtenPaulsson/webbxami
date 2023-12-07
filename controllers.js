const uniqid = require("uniqid");
const {saveToFile, getAllData} = require("./db");
module.exports = {guitars:{update,index,show,destroy,create}};


async function update(req, res){

    try {
        let guitars = getAllData();
        let guitar = guitars.find(g=>g.id == req.params.id);
    
        if(!guitar) return res.status(400).json({error: "No match"});
       
    
        let {title} = req.body;
    
        if(!title) return res.status(400).json({error: "No data"});
    
    
        guitar.title = title;
    
        await saveToFile(guitars);
        res.status(200).json(guitar);
    } catch (error) {
        res.status(500).json(error);
    }


}

async function create(req, res){


    try {
        let {title} = req.body;
    if(!title) return res.status(400).json({error:"No data"});

    let id = uniqid();

    let guitar = {id, title};



    let guitars = await getAllData();
    guitars = [guitar, ...guitars];  // lägg till först
    saveToFile(guitars);
    res.status(201).json(guitar);
    } catch (error) {
        res.status(500).json(error)
    }


}

async function destroy(req, res){

    try {
        let id = req.params.id;
    let guitars = await getAllData();
    let filteredGuitars = guitars.filter(g=>g.id!=id);
    if(filteredGuitars.length<guitars.length)
    {
        //Slänger guitars före filtered guitars
        guitars = [...filteredGuitars];
        saveToFile(guitars);
        return res.status(200).json({message:"deleted "+id});
    }
   
   
    res.status(200).json({error: "nothing deleted"});
    } catch (error) {
        res.status(500).json(error)
    }

}

async function show(req, res){
    try {
        let id = req.params.id;
        let guitars = await getAllData();
        let guitar = guitars.find(g=>g.id==id);
        if(guitar) return res.status(200).json(guitar);
    
        res.status(204).end();
    } catch (error) {
        res.status(500).json(error);
    }
  


}

async function index(req, res){
    try {
        let guitars = await getAllData();
        res.json(guitars);

    } catch (error) {
        return res.status(500).json(error);
    }
}

