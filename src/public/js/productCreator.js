const form = document.getElementById("formProductCreator");
const deleteBtn = document.getElementById("delete-btn");
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