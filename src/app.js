import express from 'express';
import exphbs from 'express-handlebars';
import ProductRouter from './routes/products.router.js';
import CartRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import DataBase from './database.js'

// Inicializa el servidor Express
const app = express();
const PUERTO = 8080;

// Configura el motor de plantillas
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


// Configura middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Rutas
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/', ViewsRouter);


// Configura el puerto y arranca el servidor
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})
 
// ProductManager
import ProductManager from './dao/db/product-manager-db.js';
import ProductModel from './dao/models/product.models.js';
const manager = new ProductManager();


// WebSocket
const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('Un cliente se conectó');
    const productos = await manager.getProducts();
    
    socket.emit('productos', productos);

    socket.on('nuevoProducto', async (producto) => {
        console.log('Producto recibido en el servidor:', producto); 
        await manager.addProduct(producto);
        const productosActualizados = await manager.getProducts();
       
        io.emit('productos', productosActualizados);
        console.log('Productos actualizados:', productosActualizados);
    });

    socket.on('eliminarProducto', async (id) => {
        await manager.deleteProduct(id);
        const productosActualizados = await manager.getProducts();

        io.emit('productos', productosActualizados);
    });
});
