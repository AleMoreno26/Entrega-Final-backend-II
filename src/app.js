import express from 'express';
import exphbs from 'express-handlebars';
import ProductRouter from './routes/products.router.js';
import CartRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import sessionsRouter from "./routes/sessions.router.js";
import cors from "cors";
import "./database.js"
import passport from 'passport';
import initializePassport from './config/config.js';

// Inicializa el servidor Express
const app = express();
const PUERTO = 8080;

// Configura el motor de plantillas
app.engine('handlebars', exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('view engine', 'handlebars');
app.set('views', './src/views');


// Configura middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(cors());


// Rutas
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/', ViewsRouter);
app.use("/api/sessions", sessionsRouter); 
// router para tickets



// Configura el puerto y arranca el servidor
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})
 
// ProductManager
import ProductManager from './dao/db/product-manager-db.js';
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
