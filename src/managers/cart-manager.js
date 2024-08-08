import fs from 'fs/promises';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async crearCarrito() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading carts file:', error);
            return [];
        }
    }

    async getCarritoById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async agregarProductosAlCarrito(cartId, productId, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) throw new Error('Cart not found');
        const productIndex = cart.products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            cart.products.push({ id: productId, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}
