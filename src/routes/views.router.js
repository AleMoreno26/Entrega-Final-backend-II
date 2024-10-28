    import express, { json } from 'express';
    const router = express.Router();
    import ProductManager from '../dao/db/product-manager-db.js';
    import ProductModel from '../dao/models/product.models.js';
    import { soloAdmin, soloUser } from '../middleware/auth.js';
    import passport from 'passport';
    const manager = new ProductManager();

    //rutas
    router.get("/login", (req, res) => {
        res.render("login"); 
    })
    router.get("/register", (req, res) => {
        res.render("register"); 
    })

    router.get("/home", (req, res) => {
        res.render("home"); 
    })

    router.get("/cart", (req, res) => {
        res.render("cart");
    })






    




    // ruta products

    router.get('/products', passport.authenticate("jwt",{session: false,}), soloUser, async (req, res) => {
        console.log("Usuario autenticado:", req.user); 
        let page = req.query.page || 1;
        let limit = 4;

        // Obtén el carrito del usuario autenticado
    const userCartId = req.user.cart;
    console.log("ID del carrito:", userCartId); 

        const paginacion = await ProductModel.paginate({}, { 
            limit, 
            page,
        });
        const productos = paginacion.docs.map(producto => producto.toObject());  // Convertir a objetos planos(permisos handlebars)
        console.log("ID del carrito:", userCartId);
        res.render('products', {
            productos,
            cid: userCartId, 
            hasPrevPage: paginacion.hasPrevPage,
            hasNextPage: paginacion.hasNextPage,
            prevPage: paginacion.prevPage,
            nextPage: paginacion.nextPage,
            currentPage: paginacion.page,
            totalPages: paginacion.totalPages
        });
    });  

    router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
            quantity: item.quantity
        }));


        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    });


    router.get('/realtimeproducts', passport.authenticate("jwt", {session: false}), soloAdmin , async (req, res) => {
        const productos = await manager.getProducts();
        res.render('realtimeproducts', { productos });
    });

    export default router;
