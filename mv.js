module.exports = {log,auth};

/* custom middleware */
function log(req,res,next){
    console.log("url = "+req.url)
    if(req.url == "/")
    return res.send("my infex route is not yet ready");

    next();
}

function auth(user){
    return function(req,res,next)
    {
        if (user == "user"){
            console.log("Auth as user");
            return next();
        }
        if (user == "admin"){
            console.log("Auth as user");
            return next();
        }
        if (user == "user"){
            return res.send("forbidden")
        }
    }
}