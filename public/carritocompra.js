const apiUrl = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    const getComprasButton = document.getElementById('get-compras');
    const carritoProductosDiv = document.querySelector('.carrito-productos');
    const comprasContainer = document.createElement('div'); // Crear un contenedor para los nuevos elementos
    carritoProductosDiv.appendChild(comprasContainer); // Agregar el contenedor

    // Realizar solicitud AJAX al cargar la página
    fetch(`${apiUrl}/compras`)
        .then(response => response.json())
        .then(compras => {
            compras.forEach((compra) => {
                const compraElement = document.createElement('div');
                let productoText = '';

                if (compra.codigo_perfume !== null && compra.codigo_recital !== null) {
                    productoText = `Productos: Perfume - ${compra.codigo_perfume}, Recital - ${compra.codigo_recital}`;
                } else if (compra.codigo_perfume !== null) {
                    productoText = `Producto: Perfume - ${compra.codigo_perfume}`;
                } else if (compra.codigo_recital !== null) {
                    productoText = `Producto: Recital - ${compra.codigo_recital}`;
                } else {
                    // No hay productos asociados, no se muestra nada
                    return;
                }

                const fechaFormateada = new Date(compra.fecha_de_compra).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                compraElement.innerHTML = `
          <h3 class="producto-titulo">${productoText}</h3>
          <p class="fecha-compra">Fecha: ${fechaFormateada}</p>
          <p class="cliente-compra">Cliente: ${compra.dni_cliente}</p>
          <p class="monto-total">Monto Total: ${compra.monto_total}</p>
          <button class="eliminar-compra" data-id="${compra.id}">Eliminar</button>
        `;
                comprasContainer.appendChild(compraElement); // Agregar el elemento dentro del contenedor
            });

            // Agregar evento click a los botones "Eliminar"
            const eliminarComprasButtons = document.querySelectorAll('.eliminar-compra');
            eliminarComprasButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    const id = event.target.dataset.id;
                    try {
                        const response = await fetch(`${apiUrl}/compras/${id}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            // Eliminar el elemento de la lista
                            event.target.parentNode.remove();
                            calculateTotal();
                        } else {
                            console.error('Error al eliminar la compra');
                        }
                    } catch (error) {
                        console.error('Error al eliminar la compra:', error);
                    }
                });
            });

            // Calcular el total de las compras
            calculateTotal();
        });

    // Función para calcular el total
    function calculateTotal() {
        let total = 0;
        const comprasContainer = document.querySelector('.carrito-productos');
        comprasContainer.querySelectorAll('.monto-total').forEach((montoTotalElement) => {
            const montoTotal = parseFloat(montoTotalElement.textContent.replace('Monto Total: ', '').replace('$', ''));
            total += montoTotal;
        });
        const totalContainer = document.querySelector('.total-container');
        const totalElement = totalContainer.querySelector('.total');
        totalElement.textContent = `Total: ${total.toFixed(2)}`;
    }

    const deleteAllButton = document.querySelector('.confirmar-compra');
    deleteAllButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${apiUrl}/compras`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Compra exitosa');
                window.location.reload();
            } else {
                console.error('Error deleting all compras');
            }
        } catch (error) {
            console.error('Error deleting all compras:', error);
        }
    });
    // Obtener todos los botones "AGREGAR AL CARRITO"
    const buyButtons = document.querySelectorAll('.buy-button');

    // Agregar evento de clic a cada botón
    buyButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            const producto = {
                id: id,
                nombre: event.target.parentNode.querySelector('.perfume-title').textContent,
                precio: event.target.parentNode.querySelector('.perfume-price').textContent
            };

            try {
                const response = await fetch(`${apiUrl}/compras`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                });

                if (response.ok) {
                    console.log('Producto agregado al carrito');
                } else {
                    console.error('Error al agregar producto al carrito');
                }
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
            }
        });
    });


});