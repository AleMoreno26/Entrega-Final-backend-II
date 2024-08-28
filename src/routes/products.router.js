import { Router } from 'express';
import ProductManager from '../dao/db/product-manager-db.js';
const router = Router();
const manager = new ProductManager();


router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const sort = req.query.sort;

    try {
        let arrayProductos = await manager.getProducts();

        // Aplicar ordenamiento si el parámetro 'sort' está presente
        if (sort === 'asc') {
            arrayProductos.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            arrayProductos.sort((a, b) => b.price - a.price);
        }

        // Limitar el número de productos si se especifica un límite
        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

//Buscar producto por id: 

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);

        if (!producto) {
            res.send("Producto no encontrado");
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.send("Error al buscar ese id en los productos");
    }
})


//Agregar nuevo producto: 

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;
    
    try {
        await manager.addProduct(nuevoProducto); 

        res.status(201).send("Producto agregado exitosamente"); 
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
})

// Eliminar producto por ID
router.delete('/:pid', async (req, res) => {
    let id = parseInt(req.params.pid);
    try {
        await manager.deleteProduct(id);
        const productosActualizados = await manager.getProducts();
        req.app.get('io').emit('productos', productosActualizados); 

        res.status(200).send('Producto eliminado');
    } catch (error) {
        res.status(500).send('Error al querer eliminar el producto seleccionado');
    }
});

export default router;
