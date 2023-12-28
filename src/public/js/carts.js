async function buy_cart(id) {

    const cart = localStorage.getItem('accessToken');
    if (cart) {//Mientras haya carrito temporal, es porque no hay usuario
        console.log("No se ha logeado para realizar la compra");
    } else {//Si no encontró la cookie, es porque ya hay un usuario        
        const cartId = `${id}`;
        const urlpurchase = '/api/carts/' + cartId + '/purchase';

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        fetch(urlpurchase, requestOptions)
            .then(response => {
                return response.json();
            })
            .then(result => {                
                if (result.message === "Compra exitosa") {
                    window.location.href = `/api/carts/tickets`;
                }
            })
            .catch(error => {
                console.log(error)
            });
    }
}