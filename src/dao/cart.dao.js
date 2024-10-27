import CartModel from "./models/cart.models.js";

class CartDao {

    async findById (id) {
        console.log("Buscando carrito con ID:", id);  // Añade este log
        return await CartModel.findById(id).populate('products.product', '_id title price');
    }

    async save (cartData) {
        const cart = new CartModel(cartData);
        return await cart.save();
    }

    async update (id, cartData) {
        return await CartModel.findByIdAndUpdate(id, cartData);
    }

    async delete(id) {
        return await CartModel.findByIdAndDelete(id);
    }
}

export default new CartDao();