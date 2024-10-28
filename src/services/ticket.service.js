import TicketModel from '../dao/models/ticket.models.js';
import { generarNumeroTicket } from '../utils/cartUtil.js'; 

class TicketService {
    async createTicket(amount, purchaser) {
        try {
            const code = generarNumeroTicket(); 
            const newTicket = new TicketModel({
                code,
                amount,
                purchaser,
                purchase_datetime: new Date() 
            });

            return await newTicket.save();
        } catch (error) {
            throw new Error('Error al crear el ticket: ' + error.message);
        }
    }
}

export default new TicketService();
