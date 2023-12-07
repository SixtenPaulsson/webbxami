const http = require("http");

http.createServer(handleServer).listen(3456, err=> {

        if(err) return console.log(err);
        console.log("lyssnar på 3456");   
});

function handleServer(req, res){

    let message = {mes: "Hello World"}
    res.writeHead(200, {"Content-Type":"application/json"});

    console.log(req);

    res.end(JSON.stringify(message));

}