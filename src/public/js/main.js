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
                             <p>${item.title}</p>
                             <p>${item.description}</p>
                             <p>${item.category}</p>
                             <p>${item.code}</p>
                             <p>${item.stock}</p>
                             <p>${item.price}</p>
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



// funcion boton eliminar carrito
function eliminarDelCarrito(productoId) {
    const carritoId = window.location.pathname.split('/').pop(); // Obtiene el ID del carrito desde la URL
    fetch(`/api/carts/${carritoId}/product/${productoId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto eliminado');
            location.reload();  // Recargar la página para actualizar la vista
        }
    })
    .catch(error => {
        console.error('Error al eliminar el producto del carrito:', error);
    });
}



// eliminar producto por socket
const eliminarProducto = (id) => {
    socket.emit('eliminarProducto', id);
};

//agregar productos mediante formulario 
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

