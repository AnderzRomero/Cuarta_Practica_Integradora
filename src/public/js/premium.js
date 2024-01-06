const premiumForm = document.getElementById("premiumForm");
const uploadFile = document.querySelectorAll("input[type='file']");

console.log("Documentos cargados desde el formulario", uploadFile);

let currentLoadingElement = null;

const fetchUser = async () => {
  const response = await fetch("/api/sessions/current", {
    method: "GET",
  });
  if (!response || !response.ok) {
    throw new Error("No se pudo obtener la información del usuario");
  }
  const result = await response.json();
  const user = result.payload;

  if (!user) {
    throw new Error("El usuario no está definido");
  }

  return user;
};

uploadFile.forEach((file) => {
  file.addEventListener("change", (event) => {
    if (currentLoadingElement) {
      currentLoadingElement.parentNode.removeChild(currentLoadingElement);
    }

    const loading = document.createElement("span");
    loading.innerHTML = "Listo, siguiente por favor";
    event.target.parentNode.appendChild(loading);

    currentLoadingElement = loading;
  });
});
fetchUser();
premiumForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  premiumForm.querySelector("#premiumSubmit").disabled = true;

  try {
    const user = await fetchUser();

    const formData = new FormData(premiumForm);

    const response = await fetch(`/api/users/${user.id}/documents`, {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.status === "success" || response.status === 200) {
        // Mensaje de éxito
        Swal.fire({
          title: "¡Felicitaciones!",
          text: "Tu documentación ha sido guardada con exito, ¡Gracias!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Error en la solicitud:", response.error);
      }
    });
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
  } finally {
    premiumForm.querySelector("#premiumSubmit").disabled = false;

    if (currentLoadingElement) {
      currentLoadingElement.parentNode.removeChild(currentLoadingElement);
      currentLoadingElement = null;
    }
  }
});
