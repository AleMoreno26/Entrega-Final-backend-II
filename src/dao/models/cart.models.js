// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     products: [

//         {
//             user: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'user',
//                 required: true,
//             },
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//             },
//         }],

// });

// const CartModel = mongoose.model('Cart', cartSchema);

// export default CartModel;
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user',  
    //     required: true,
    // },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        }
    ],
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
