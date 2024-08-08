import { Router } from 'express';
import CartManager from '../managers/cart-manager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

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
    let carritoId = parseInt(req.params.cid);

    try {
        const carrito = await cartManager.getCarritoById(carritoId);
        res.json(carrito.products);
    } catch (error) {
        res.status(500).send('Error al cargar los productos del carrito');
    }
});

// Ruta para agregar productos al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    let carritoId = parseInt(req.params.cid);
    let productoId = parseInt(req.params.pid);
    let quantity = parseInt(req.body.quantity) || 1;

    try {
        const actualizado = await cartManager.agregarProductosAlCarrito(carritoId, productoId, quantity);
        res.json(actualizado);
    } catch (error) {
        res.status(500).send('Error al agregar un producto');
    }
});

export default router;
