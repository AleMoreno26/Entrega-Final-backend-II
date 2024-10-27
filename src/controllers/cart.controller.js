
import { cartService } from "../services/index.js";


class CartController {

    async create(req, res) {
        try {

            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {

            res.status(500).json({ message: "Error al crear el carrito", error: error.message });
        }
    }

    async getCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");
            res.send(cart);
        } catch (error) {
            res.status(500).send("Error al leer el carrito");
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");

            const existingProduct = cart.products.find(item => item.product.toString() === pid);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }

            await cartService.updateCart(cid, cart);
            res.status(200).send(cart);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al agregar productos");
        }
    }



    async removeProductFromCart(req, res) {
        const { cid, pid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");

            cart.products = cart.products.filter(item => item.product.toString() !== pid);
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("Error al eliminar producto del carrito");
        }
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");

            const product = cart.products.find(item => item.product.toString() === pid);
            if (!product) return res.status(404).send("Producto no encontrado en el carrito");

            product.quantity = quantity; // Actualiza la cantidad directamente en el carrito
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad del producto");
        }
    }

    async clearCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("Carrito no encontrado");

            cart.products = [];
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("Error al vaciar el carrito");
        }
    }
}

export default CartController;
