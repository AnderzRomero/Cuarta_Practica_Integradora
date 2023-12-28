const ticket = document.getElementById('ticket');
const finish = document.getElementById("finish");

// Accede al elemento que contiene el ID del carrito
const cartIdElement = document.getElementById('cartId');
const userNameElement = document.getElementById('userName');

// Obtiene el valor del atributo data-cartid
const cartId = cartIdElement.dataset.cartid;
const userName = userNameElement.dataset.username;

const ticketResponse = async () => {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json());
    const data = response.payload;    
    if (data) {
        ticket.innerHTML = `<div class="contenedorTicket"><h4>Ticket #${data.code}</h4>
                        <p>Hecho el ${data.purchase_datetime}</p>
                        <p>Vendido y entregado por <strong>Hero Systems</strong></p>
                        <p>${userName}</p>
                        <p>${data.purchaser}</p>
                        <p>Productos:</p>
                        <table class="table">
                        <thead class="tablehead">
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio unitario</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Subtotal</th>
                            </tr>
                        </thead>
                    <tbody>
                      ${data.products.map((product) => {
                            return `<tr>
                                        <td><img class="img-ticket" src=${product._id.thumbnail} alt=${product._id.title}></td>
                                        <td>${product._id.title}</td>
                                        <td>$ ${product._id.price}</td>
                                        <td>${product.quantity}</td>
                                        <td>$ ${product.quantity * product._id.price}</td>
                                    </tr>`;
                        }).join("")}
                        <tr>
                        <td></td><td></td><td></td><td><strong>Total</strong></td><td><strong>$ ${data.amount}</strong></td>
                        </tr>
                    </tbody>
                    </table>
                    </div>
                   `;
    }
    finish.addEventListener("click", async () => {
        Swal.fire({
            icon: "success",
            title: "Gracias por tu compra!",
            text: "Se envió un correo con los detalles de su compra.",
            confirmButtonText: "Ok",
        }).then(async () => {
            const deleteCart = await fetch(`/api/carts/products`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            ticket.innerHTML = "";
            window.location.href = "/api/products";
        });
    });
};

ticketResponse();