const form = document.getElementById("formProductCreator");
const deleteBtn = document.getElementById("delete-btn");
document.getElementById('delete-btn').addEventListener('click', function () {
  const productId = document.getElementById('pid').value;
  DeleteProduct(productId);
});

const addBtn = document.getElementById("add-btn");

fetch("/api/sessions/current")
  .then((response) => response.json())
  .then((userData) => {
    if (userData.payload.role === "admin") {
      deleteBtn.disabled = false;
      addBtn.disabled = false;
    } else if (userData.payload.role === "premium") {
      deleteBtn.disabled = true;
      addBtn.disabled = false;
    }
  })
  .catch((error) => console.error(error));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData
  })
  const result = await response.json();

  if (result.status === "success") {
    // // Redirige a la ruta deseada    
    Swal.fire({
      title: "Se registro correctamente el producto!",
      icon: "success",
      position: "top-end",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/api/products';
      }
    });
  } else {
    console.log("Hubo un error al crear el producto");
  }
});

function DeleteProduct(productId) {
  Swal.fire({
    title: "Confirma si deseas eliminar producto o Actualizar estado?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Actualizar Estado",
    denyButtonText: `Eliminar producto`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch(`/api/products/status/${productId}`, {
        method: 'PUT',
        // Otras configuraciones como headers, body, etc. si son necesarias
      })
        .then(response => {
          if (response.ok) {
            Swal.fire("Producto Actualizado exitosamente!", "", "success");
            // Realiza alguna acción adicional si es necesario, como recargar la página o actualizar la lista de productos
          } else {
            throw new Error('Error al Actualizar el producto');
          }
        })
        .catch(error => {
          console.error('Error al Actualizar el producto:', error.message);
        });

    } else if (result.isDenied) {
      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        // Otras configuraciones como headers, body, etc. si son necesarias
      })
        .then(response => {
          if (response.ok) {
            // Producto eliminado exitosamente
            Swal.fire("Producto eliminado exitosamente", "", "info");
            // Realiza alguna acción adicional si es necesario, como recargar la página o actualizar la lista de productos
          } else {
            throw new Error('Error al eliminar el producto');
          }
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error.message);
          // Manejo de errores: muestra un mensaje de error o realiza alguna acción adicional
        });
    }
  });
}