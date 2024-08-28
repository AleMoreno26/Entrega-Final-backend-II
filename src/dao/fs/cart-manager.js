// Fyre Sistem
import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        this.caragrCarritos();
    }

    async caragrCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos desde el archivo", error);
            await this.guardarCarrito();
        }
    }

    async guardarCarrito() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    // Crear carrito
    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(nuevoCarrito);

        // Guardar
        await this.guardarCarrito();
        return nuevoCarrito;
    }

    // Retornar un carrito por ID
    async getCarritoById(carritoId) {
        try {
            const carrito = this.carts.find(e => e.id === carritoId);

            if (!carrito) {
                throw new Error("No existe carrito con ese ID");
            }

            return carrito;
        } catch (error) {
            console.error(`Error al obtener el carrito por ID: ${error.message}`);
            throw error;
        }
    }

    // Agregar productos al carrito
    async agregarProductosAlCarrito(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }

        await this.guardarCarrito();
        return carrito;
    }
}

export default CartManager;
