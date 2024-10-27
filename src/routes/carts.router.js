import express from "express";
import Router from 'express';
import { cartService } from '../services/index.js'
import TicketService from '../services/ticket.service.js';
import { calcularTotal } from '../utils/cartUtil.js'; // Asegúrate de importar la función calcularTotal.
import CartController from '../controllers/cart.controller.js';
import ProductModel from '../dao/models/product.models.js';

 
const router = Router();
const controller = new CartController();


// Ruta para crear un nuevo carrito
router.post('/', controller.create);
// Ruta para listar productos en un carrito
router.get('/:cid', controller.getCart);
// Ruta para agregar productos al carrito 
router.post('/:cid/product/:pid', controller.addProductToCart);
// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', controller.updateProductQuantity);
// Ruta para eliminar un producto específico del carrito
router.delete('/:cid/product/:pid', controller.removeProductFromCart);
// Ruta para vaciar un carrito
router.delete('/:cid', controller.clearCart);


// Ruta para finalizar la compra
router.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartService.getCartProducts(cartId);
        const idsNoProcesados = [];
        const productosComprados = [];

        for (const item of carrito) {
            const producto = await ProductModel.findById(item.product._id);
            if (producto.stock >= item.quantity) {
                producto.stock -= item.quantity;
                await producto.save();
                productosComprados.push(item);
            } else {
                idsNoProcesados.push(item.product._id); // Almacenar id del producto no procesado
            }
        }

        // Crear ticket solo si hay productos comprados
        if (productosComprados.length > 0) {
            const total = calcularTotal(productosComprados);
            const ticket = await TicketService.createTicket(total, req.user.email);
            res.status(200).json({ ticket, idsNoProcesados });
        } else {
            res.status(400).json({ message: 'No se pudo procesar la compra', idsNoProcesados });
        }

        // Actualizar carrito con los productos no comprados
        const productosRestantes = carrito.filter(item => idsNoProcesados.includes(item.product._id));
        await CartService.updateCart(cartId, productosRestantes);
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
