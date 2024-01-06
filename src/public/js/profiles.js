const profile = document.getElementById("profile");
const logoutButton = document.getElementById("logout");

const renderUserView = (payload) => {
    let content;
    switch (payload.role) {
        case "user":
            if (payload.isPremium === false) {
                content = `
          <p class="profileName"><strong>Hola!  </strong>${payload.name}</p>
          <p class="profileEmail"><strong>Email:</strong> ${payload.email}</p>
          <p class="profileRole"><strong>Rol:</strong> ${payload.role}</p>
          <h5> ¿Deseas ser premium? Primero debe agregar la documentación!</h5>
          <button class="btn btn-card" onclick="premium()">Agregar documentos</button>
        `;
            } else {
                content = `
          <p class="profileName"><strong>Hola!  </strong>${payload.name}</p>
          <p class="profileEmail"><strong>Email:</strong> ${payload.email}</p>
          <p class="profileRole"><strong>Rol:</strong> ${payload.role}</p>
          <h5> Ya cumples con los requisitos para ser premium</h5>
          <button class="btn btn-card" onclick="updateUserPremiumStatus('${payload.id}')">Ser premium</button>
        `;
            }
            break;

        case "premium":
            content = `
          <p class="profileName"><strong>Hola!  </strong>${payload.name}</p>
          <p class="profileEmail"><strong>Email:</strong> ${payload.email}</p>
          <p class="profileRole"><strong>Rol:</strong> ${payload.role}</p>
          <h5> ¿Deseas Empezar a vender productos?</h5>
          <button class="btn btn-card" onclick="productCreator()">Sí</button>
      `;
            break;

        case "admin":
            content = `
        <p class="profileName"><strong>Hola!  </strong>${payload.nombres}</p>
        <p class="profileRole"><strong>Rol:</strong> ${payload.role}</p>
        <br>
        <h5> Ir al panel de administración de productos</h5>
        <button class="btn btn-card mb-4" onclick="productCreator()">Sí</button>
        <br>
        <h5> Ir al panel de administración de Usuarios</h5>
        <a href="/api/users" class="btn btn-card">Sí</a>
      `;
            break;

        default:
            content = "Rol no reconocido";
    }

    profile.innerHTML = `
    <div>${content}</div>
  `;
};

const fetchCurrentUser = async () => {
    try {
        const response = await fetch("/api/sessions/current", {
            method: "GET",
        });
        if (response.ok) {
            const result = await response.json();
            renderUserView(result.payload);
            return result.payload;
        }
    } catch (error) {
        console.error(error);
    }
};

async function premium() {
    window.location = "/premium";
}

async function productCreator() {
    window.location = "/productCreator";
}

const updateUserPremiumStatus = async (uid) => {
    fetchCurrentUser();
    const premiumUser = await fetch(`/api/users/premium/${uid}`, {
        method: "PUT",
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                renderUserView(data.payload);
            }
            // console.log("Informacion de la data del fetch", data.payload.role);
        });
};

fetchCurrentUser();
renderUserView();
