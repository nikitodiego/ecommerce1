let modulo = require("./claseProductos")
const prod = new modulo.nombreExportacion("./productos.json");
let moduloCarrito = require("./claseCarrito")
const carro = new moduloCarrito.Carro("./carrito.json");

const express = require('express');
const app = express();
const { Router } = require('express');
const router = Router();
const routerCarrito = Router();

//Middlewares
app.use('/api/productos', router);
app.use('/api/carrito',routerCarrito);
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(express.static('public_productos'));
app.use("/carrito",express.static('public_carrito'));


//Websocket
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//Cargo el archivo en memoria para el socket

const fs = require('fs');
const jsonData = fs.readFileSync("productos.json");
const data = JSON.parse(jsonData);

const messages = [
    { author: "juan@gmail.com", date: "2022-01-29T18:59:43.106Z", text: "¡Hola! ¿Que tal?" },
    { author: "pedro@gmail.com", date: "2022-01-29T18:59:43.106Z", text: "¡Muy bien! ¿Y vos?" },
    { author: "ana@gmail.com", date: "2022-01-29T18:59:43.106Z", text: "¡Genial!" }
 ]; 
 
io.on('connection', socket => {
    console.log('Un cliente se ha conectado', socket.id);
    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
        //fs.writeFileSync("chat.json",(JSON.stringify(messages)));
    });
    socket.emit('messages', messages);
    //Enviar lista de productos
    socket.emit('productos', data);
});


//Endpoints
app.get("/", (req,res) =>{
    res.redirect("/form.html");
})

router.get('/', async (req,res) => {
    const a = await prod.getAll();
    res.send(a);
});

router.get('/:id', async (req,res) => {
    const {id} = req.params;
    const a = await prod.getById(id);
    if (a == null){
        res.json({ error : 'producto no encontrado'});
    } else {
        res.json(a);
    }
});

app.post('/form.html', async (req, res) => {
    const a = await req.body;
    const b = await prod.save(req.body);
    const c = await prod.getById(b);
    res.redirect("/form.html");
  });


router.delete('/:id', async (req,res) =>{
    const {id} = req.params;
    const a = await prod.getById(id);
    if (a == null){
        res.json({ error : 'producto no encontrado'});
    } else {
        const b = await prod.deleteById(id);
        const c = await prod.getAll();
        res.json(c);
    }

});

app.put('/api/productos/:id', (req,res) =>{
    let id = req.params.id;
    console.log(id);
    let a = req.body;
    let b = a.title;
    let c = a.price;
    let d = a.thumbnail;
    let e = a.stock;
    const fs = require('fs');
    const jsonData = fs.readFileSync("productos.json");
    const data = JSON.parse(jsonData);
    for (element of data){
        if (element.id == id){
            element.title = b;
            element.price = c;
            element.thumbnail = d;
            element.stock = e;
        }
    }
    fs.writeFileSync("productos.json", (JSON.stringify(data)));
    res.json(data);
});

//Endpoints carrito

routerCarrito.get('/', async (req,res) => {
    const a = await carro.getAll();
    res.send(a);
})


app.post('/api/pay', (req, res) => {
    //Guardo carrito
    const a = req.body;
    const b = carro.save(a);
    //Descuento stock
    const ids = req.body["productos"];
    const fs = require('fs');
    let producto = [];
    const arrayProductos = JSON.parse(fs.readFileSync("productos.json"));
    ids.map(element => {
        producto = arrayProductos.find(p => p.id === element)
        producto.stock--;
    });
    fs.writeFileSync("productos.json",JSON.stringify(arrayProductos));
    res.json(ids);
  });


//Esta funcion es para borrar un producto por id de un determinado carrito con su propio id, me funciona la lógica de la función pero no la ruta. 
function idid(id,id_p,array){
    for (let n of array) {
        if ((n.id == id) && (n.productos.includes(id_p))) {
            let index = n.productos.indexOf(id_p)
            n.productos.splice(index, 1);
            break;
        }
    }
}
routerCarrito.delete("/:id/:id_p", (req,res) =>{
    const id = req.params.id;
    const id_p = req.params.id_p;
    const fs = require('fs');
    const leer = fs.readFileSync("carrito.json");
    let array = JSON.parse(leer);
    idid(id,id_p,array);
    fs.writeFileSync(this.nombre,JSON.stringify(array));
    console.log(array);
    res.json(array);
});


routerCarrito.delete('/:id', async (req,res) =>{
    const {id} = req.params;
    const a = await carro.getById(id);
    if (a == null){
        res.json({ error : 'producto no encontrado'});
    } else {
        const b = await carro.deleteById(id);
        const c = await carro.getAll();
        res.json(c);
        }
});


const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, function() {
    console.log(`Server on port ${PORT}`);
})
