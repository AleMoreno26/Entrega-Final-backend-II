import { productService } from "../services/index.js";

class ProductController {

    async getProducts(req, res) {
        const { limit = 10, page = 1, sort, query } = req.query;
        try {
            const products = await productService.getProducts({ limit, page, sort, query }); //ver si es getProducts o sin la s 
            res.send(products);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async getProductByid(req, res) {
        const { pid } = req.params;
        try {
            const product = await productService.getProductById(pid);
            if (!product) return res.status(404).send("producto no encontrado")
            res.send(product);
        } catch (error) {
            res.status(500).send("error interno en el servidor")
        }
    }

    async createProduct(req, res) { 
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).send(product);
        } catch (error) {
            res.status(500).send("error interno del servidor");
        }
    }

    async updateProduct(req, res) {
        const { pid } = req.params;
        const productData = req.body; 
    
        try {
            const updatedProduct = await productService.updateProduct(pid, productData);
            if (!updatedProduct) return res.status(404).send("Producto no encontrado");
    
            res.send(updatedProduct);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params; 
    
        try {
            const deletedProduct = await productService.deleteProduct(pid);
            if (!deletedProduct) return res.status(404).send("Producto no encontrado");
    
            res.send({ message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

export default ProductController;