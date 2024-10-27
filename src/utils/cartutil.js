const calcularTotal = (products) => {
    return products.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const generarNumeroTicket = () => {
    return Math.floor(100000 + Math.random() * 900000); 
};

export { calcularTotal, generarNumeroTicket };
