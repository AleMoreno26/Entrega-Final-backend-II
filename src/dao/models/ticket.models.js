import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
code: {
    type: String,
    unique: true,
    required: true
},
purchase_detetime: {
    type: Date,
    default: Date.now,
    required: true
},
amount: {
    type: Number,
    required: true
},
purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    requerid: true
}
});

const TicketModel = mongoose.model("ticket", ticketSchema);
export default TicketModel; 