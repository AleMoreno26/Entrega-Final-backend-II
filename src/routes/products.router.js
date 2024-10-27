import Router from 'express';
const router = Router();
import ProductController from '../controllers/product.controller.js';
const controller = new ProductController();


router.get("/", controller.getProducts);

//Buscar producto por id: 

router.get("/:pid", controller.getProductByid);


// Agregar nuevo producto:
router.post("/", controller.createProduct);

// Actualizar producto por ID:
router.put("/:pid", controller.updateProduct); 

// Eliminar producto por ID:
router.delete('/:pid', controller.deleteProduct)

export default router;
