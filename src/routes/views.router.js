import express from 'express';
const router = express.Router();
import ProductManager from '../managers/product-manager.js';
const manager = new ProductManager("./src/data/productos.json");

router.get('/products', async (req, res) => {
    const productos = await manager.getProducts();
    res.render('home', {productos});
});

router.get('/realtimeproducts', async (req, res) => {
    const productos = await manager.getProducts();
    res.render('realtimeproducts', { productos });
});

export default router;
