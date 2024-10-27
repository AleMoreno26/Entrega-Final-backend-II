import TicketService from '../services/ticket.service.js';

export const checkoutController = async (req, res) => {
  try {
    const { amount, purchaser } = req.body;
    const ticket = await TicketService.createTicket(amount, purchaser);
    res.status(201).json({ message: 'Compra finalizada con éxito', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default checkoutController;