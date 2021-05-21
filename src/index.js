
const http = require("http"); 
const { parse } = require("path");
const { bodyParser } = require("./post")

const PORT = 8080 ;
let dataBase = [] ;

function getTaskHandler(req, res){
    try {
        res.writeHead(200, {"Content-Type":"application/json"})
    res.write(JSON.stringify(dataBase))
    res.end()
    } catch (error) {
        console.log(error+ " on getting")
    res.writeHead(404, {"Content-Type":"text/plain"} );
    res.write(  "<h1>Error en l envío</h1>" );
    res.end()  ;
    }
}

async function postTaskHandler(req, res){
   try {
    await bodyParser(req);
    dataBase.push(req.body);
  res.writeHead(200, {"Content-Type":"application/plain"} );
  res.write( "message sent"  );
  res.end() ;  
   } catch (error) {
    console.log(error+" on posting")
    res.writeHead(404, {"Content-Type":"text/plain"} );
    res.write(  "<h1>Error en l envío</h1>" );
    res.end() ;    
   }
}

async function putTaskHandler(req, res){
    try {
        await bodyParser(req)
        let {url} = req ;
        let myUrl = (url.split("?")[1]).split("=") ;
        let key = myUrl[0] ;
        let value = myUrl[1] ;
    if( key === "Id" ){
        dataBase[value - 1] = req.body
     res.writeHead(200, {"Content-Type":"text/plain"});
     res.write("data modified");
     res.end(); 
    }else{
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.write("invalid update");
        res.end();
    }
    } catch (err) {
        console.log(err)
    }
}

async function deleteTaskHandler(req, res){
  try {
    await bodyParser(req)
    let { url } = req ;
    let index = url.split("?")[1]
    let key = index[0] ;
    let value = index[1] ; 

    if( key === "Id" ){
    dataBase.splice(value, 1) ;
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.write("data deleted");
    res.end(); 
    }else{
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.write("invalid deletion");
        res.end();
    }
  } catch (error) {
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.write("error on deletion");
    res.end();
  }
}


const server = http.createServer((req, res) => {

    const { url , method } = req 

    switch(method){
        case "GET": 
            if( url === "/" ){
                res.writeHead(200, {"Content-Type":"application/json"})
                res.write(JSON.stringify({"mensaje": "buenas a todos"}))
                res.end()
            }
            if( url === "/tasks" ){
                     getTaskHandler(req, res)
            }     
            break;
        case "POST":
            if( url === "/tasks"){
                  postTaskHandler(req, res)
            }
            break;
         case "PUT":
             putTaskHandler(req, res)
              
         break;
         case "DELETE":
                deleteTaskHandler(req, res)
         default:{ return console.log("Default")}
         break;
    } 
}).listen(PORT, console.log(`connected in port: ${PORT}`))

