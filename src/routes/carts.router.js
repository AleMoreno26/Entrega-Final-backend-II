import { Router } from 'express';
import CartManager from '../dao/db/cart-manager-db.js';

const router = Router();
const cartManager = new CartManager();

// Ruta para visualizar los productos en un carrito específico
router.get('/cart/:cid', async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);
    
        // Convierte los productos a objetos planos para Handlebars
        const productos = carrito.products.map(product => product.toObject());
        res.render('carts', { productos });
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});


// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).send('Error de servidor');
    }
});

// Ruta para listar productos en un carrito
router.get('/:cid', async (req, res) => {
    let carritoId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(carritoId);
        res.json(carrito.products);
    } catch (error) {
        res.status(500).send('Error al cargar los productos del carrito');
    }
});

// Ruta para agregar productos al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    let carritoId = req.params.cid;
    let productoId = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const actualizado = await cartManager.agregarProductosAlCarrito(carritoId, productoId, quantity);
        res.json(actualizado);
    } catch (error) {
        res.status(500).send('Error al agregar un producto');
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const { quantity } = req.body;

    if (quantity === undefined || quantity <= 0) {
        return res.status(400).send('La cantidad debe ser un número positivo');
    }

    try {
        const carritoActualizado = await cartManager.actualizarCantidadProducto(carritoId, productoId, quantity);
        res.json(carritoActualizado);
    } catch (error) {
        res.status(500).send(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
});

// Ruta para vaciar un carrito
router.delete('/:cid', async (req, res) => {
    let carritoId = req.params.cid;

    try {
        const carritoVaciado = await cartManager.vaciarCarrito(carritoId);
        res.json(carritoVaciado);
    } catch (error) {
        res.status(500).send(`Error al vaciar el carrito: ${error.message}`);
    }
});

export default router;
