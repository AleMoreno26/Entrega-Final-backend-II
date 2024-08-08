// src/public/js/main.js
const socket = io();

socket.on('productos', (data) => {
    // console.log(data); 
    renderProductos(data);
});

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById('contenedorProductos');
    contenedorProductos.innerHTML = '';
    
    productos.forEach(item => {
        const card = document.createElement('div');
        card.innerHTML = `
            <p>ID: ${item.id}</p>
            <p>Título: ${item.titulo}</p>
            <p>Descripción: ${item.descripcion}</p>
            <p>Precio: ${item.precio}</p>
            <button onclick="eliminarProducto(${item.id})">Eliminar</button>
        `;
        contenedorProductos.appendChild(card);
    });
};

const eliminarProducto = (id) => {
    socket.emit('eliminarProducto', id);
};

document.getElementById('nuevoProductoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoProducto = {
        titulo: e.target.titulo.value,
        descripcion: e.target.descripcion.value,
        precio: parseFloat(e.target.precio.value),
        codigo: e.target.codigo.value,
        stock: parseInt(e.target.stock.value)
    };
    socket.emit('nuevoProducto', nuevoProducto);
    e.target.reset();
});
