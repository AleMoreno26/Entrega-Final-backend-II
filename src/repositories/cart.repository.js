import { populate } from "dotenv";
import cartDao from "../dao/cart.dao.js";
import CartModel from "../dao/models/cart.models.js";

class CartRepository {

    async createCart() {
        return await cartDao.save({products: []});
    }

    async getCartById(id) {
        return cartDao.findById(id);
    }

    async updateCart(id, cartData) {
        return await cartDao.update(id, cartData);
    }

    async deleteCart(id) {
        return await cartDao.delete(id);
    }
    async findById(id) {
        return await CartModel.findById(id).populate('products.product', '_id title price');
    }
}

export default CartRepository;


