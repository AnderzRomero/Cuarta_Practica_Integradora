const form = document.getElementById('restoreForm');
const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});


form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    obj.token = urlParams.token;
    const response = await fetch('/api/sessions/password-restore', {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                Swal.fire({
                    title: "Se realizo el cambio de contraseña correctamente!",
                    icon: "success",
                    position: "top-end",
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.href = '/login';
                    }
                });
            }
        })
})