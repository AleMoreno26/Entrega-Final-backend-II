import CartModel from '../models/cart.models.js';

class CartManager {
    // Crear carrito
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear un carrito");
            return null;
        }
    }

    // Retornar un carrito por ID
    async getCarritoById(carritoId) {
        try {
            const carrito = await CartModel.findById(carritoId);

            if (!carrito) {
                console.log("No existe carrito con ese ID");
                return null;
            }
            return carrito;
        } catch (error) {
            console.log(`Error al obtener el carrito por ID: ${error.message}`);
            throw error;
        }
    }

    // Agregar productos al carrito
    async agregarProductosAlCarrito(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            const existeProducto = carrito.products.find(item => item.product.toString() === productoId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }

            // Actualizar y guardar el carrito
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log(`Error al agregar producto al carrito: ${error.message}`);
            throw error;
        }
    }

    // Actualizar cantidad de un producto en el carrito
    async actualizarCantidadProducto(carritoId, productoId, nuevaCantidad) {
        try {
            const carrito = await this.getCarritoById(carritoId);

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            const existeProducto = carrito.products.find(item => item.product.toString() === productoId);

            if (!existeProducto) {
                throw new Error('Producto no encontrado en el carrito');
            }

            existeProducto.quantity = nuevaCantidad;

            // Actualizar y guardar el carrito
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
            throw error;
        }
    }

    // Vaciar el carrito
    async vaciarCarrito(carritoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            // Vaciar los productos del carrito
            carrito.products = [];

            // Actualizar y guardar el carrito
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log(`Error al vaciar el carrito: ${error.message}`);
            throw error;
        }
    }
}



export default CartManager;
