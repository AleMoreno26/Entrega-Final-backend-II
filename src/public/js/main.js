// src/public/js/main.js
const socket = io();

socket.on('productos', (producto) => {
    // console.log(data);
renderProductos(producto);
});

const renderProductos = (productos) => {
    
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `   <p >${item.id}</p>
                             <p>${item.titulo}</p>
                             <p>${item.descripcion}</p>
                             <p>${item.precio}</p>
                             <button>Eliminar</button>
                         `
        contenedorProductos.appendChild(card);

        // Botón para eliminar producto
        card.querySelector("#eliminarProducto").addEventListener("click", () => {
            eliminarProducto(item.id);
        });

        // Botón para agregar producto al carrito
        card.querySelector("#agregarCarrito").addEventListener("click", () => {
            agregarAlCarrito(item);
        })
    })
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

    console.log('Nuevo producto enviado al servidor:', nuevoProducto);
    socket.emit('nuevoProducto', nuevoProducto);
    e.target.reset(); 
});

