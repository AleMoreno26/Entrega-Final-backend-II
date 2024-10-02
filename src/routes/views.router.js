import express from 'express';
const router = express.Router();
import ProductManager from '../dao/db/product-manager-db.js';
import ProductModel from '../dao/models/product.models.js';
const manager = new ProductManager();


router.get("/login", (req, res) => {
    res.render("login"); 
})
router.get("/register", (req, res) => {
    res.render("register"); 
})

router.get("/home", (req, res) => {
     res.render("home"); 
 })



// ruta products

router.get('/products', async (req, res) => {
    let page = req.query.page || 1;
    let limit = 4;

    const paginacion = await ProductModel.paginate({}, { 
        limit, 
        page,
    });
    const productos = paginacion.docs.map(producto => producto.toObject());  // Convertir a objetos planos(permisos handlebars)
    
    res.render('home', {
        productos,
        hasPrevPage: paginacion.hasPrevPage,
        hasNextPage: paginacion.hasNextPage,
        prevPage: paginacion.prevPage,
        nextPage: paginacion.nextPage,
        currentPage: paginacion.page,
        totalPages: paginacion.totalPages
     });
});  

router.get('/carts', async (req, res) => {
    const productos = await manager.getProducts();
    res.render('carts', { productos });
});


router.get('/realtimeproducts', async (req, res) => {
    const productos = await manager.getProducts();
    res.render('realtimeproducts', { productos });
});

export default router;
