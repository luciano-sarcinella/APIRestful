let fs = require("fs")
let express = require("express");
let app = express();
const PORT = 8080;
let path = require("path");
let Handle = require("./manejarArchivos");

let manejarArchivos = new Handle("./productos.txt");

let {Router} = express;
let router = new Router;
let routerId = new Router;

app.use(express.urlencoded());
app.use(express.json());


router.get("/", (req,res,next) => {
    manejarArchivos.getAll().then(data => {
        res.send(data);
    }).catch(error => {
        res.send(error);
    });
});

router.post("/",(req,res,next) => {
    manejarArchivos.save(req.body.producto).then(data => { 
        res.json(data);
    }).catch(error => {
        res.send(error);
    });
});

router.delete("/:id", (req,res,next) => {
    let id = req.params.id;
    manejarArchivos.deleteById(id).then(data => {
        res.send(data);
    }).catch(error => {
        res.send(error);
    });
});

routerId.get("/:id", (req,res,next) => {
    let id = req.params.id;    
    
    manejarArchivos.getbyId(id).then(data => {
        if(data){
            res.send(data);
        }else{
            res.send({error: "producto no encontrado"});
        }
       
    }).catch(error => {
        res.send(error);
    });
});


routerId.put("/",(req,res,next) => { 
    let producto = req.body;
    manejarArchivos.update(producto).then(data => {
        res.json(data);
    }).catch(error => {
        res.send(error);
    });
});

app.use("/api/productos", router);
app.use("/api/productos", routerId);
app.use("/api",express.static(path.join(__dirname, 'public','html')));

app.get("/", (req,res,next) => {    
    res.send("<h1>Server de luchi con express</h1>");
});

app.listen(PORT, () => {
  console.log(`Mi servidor escuchando desde http://localhost:${PORT}`);
});

