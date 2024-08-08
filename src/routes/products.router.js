import { Router } from 'express';
import ProductManager from '../managers/product-manager.js';

const router = Router();
const manager = new ProductManager('./src/data/productos.json');

// Listar todos los productos
router.get('/', async (req, res) => {
    let limit = req.query.limit;

    try {
        const arrayProductos = await manager.getProducts();
        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// Buscar producto por ID
router.get('/:pid', async (req, res) => {
    let id = parseInt(req.params.pid);
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.status(404).send('Producto no encontrado');
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.status(500).send('Error al buscar ese ID en los productos');
    }
});

// Agregar nuevo producto
router.post('/', async (req, res) => {
    const nuevoProducto = req.body;
    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).send('Producto agregado');
    } catch (error) {
        res.status(500).send('Error al querer agregar el producto seleccionado');
    }
});

// Actualizar producto por ID
router.put('/:pid', async (req, res) => {
    let id = parseInt(req.params.pid);
    const productoActualizado = req.body;
    try {
        await manager.updateProduct(id, productoActualizado);
        res.status(200).send('Producto actualizado');
    } catch (error) {
        res.status(500).send('Error al querer actualizar el producto seleccionado');
    }
});

// Eliminar producto por ID
router.delete('/:pid', async (req, res) => {
    let id = parseInt(req.params.pid);
    try {
        await manager.deleteProduct(id);
        res.status(200).send('Producto eliminado');
    } catch (error) {
        res.status(500).send('Error al querer eliminar el producto seleccionado');
    }
});

export default router;
