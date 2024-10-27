import CartModel from "../dao/models/cart.models.js";
import userRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/util.js";

class UserServices {
    async registerUser(userData) {
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if (existingUser) {
            const error = new Error("El usuario ya existe");
            error.code = 'USER_EXISTS'; 
            throw error;
        }; 

        // Crear un carrito y asociar el ID al usuario
    const newCart = new CartModel({ user: null, products: [] });
    const savedCart = await newCart.save();  // Guarda el carrito y obtén su ID

    // Asignar el carrito al usuario
    userData.cart = savedCart._id;


        userData.password = createHash(userData.password); 
        return await userRepository.createUser(userData); 
    }

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email); 
        if(!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas"); 
        return user; 
    }

    async getUserById(id) {
        return await userRepository.getUserById(id); 
    }

    // metodo para actulizar y borar usuarios
}

export default new UserServices(); 