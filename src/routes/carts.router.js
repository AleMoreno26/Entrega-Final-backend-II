import { Router } from 'express';
import passport from 'passport'; 
import { cartService } from '../services/index.js'
import TicketService from '../services/ticket.service.js';
import { calcularTotal } from '../utils/cartUtil.js';
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
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await cartService.findById(cartId);
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const idsNoProcesados = [];
        const productosComprados = [];

        for (const item of carrito.products) {
            const producto = await ProductModel.findById(item.product._id);
            if (producto && producto.stock >= item.quantity) {
                producto.stock -= item.quantity;
                await producto.save();
                productosComprados.push(item);
            } else {
                idsNoProcesados.push(item.product._id);
            }
        }

        if (productosComprados.length > 0) {
            const total = calcularTotal(productosComprados);
            //  ID del usuario
            const ticket = await TicketService.createTicket(total, req.user.id);
            res.status(200).json({ ticket, idsNoProcesados });
        } else {
            res.status(400).json({ message: 'No se pudo procesar la compra', idsNoProcesados });
        }

        const productosRestantes = carrito.products.filter(item => idsNoProcesados.includes(item.product._id));
        await cartService.updateCart(cartId, { products: productosRestantes });
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
