const form = document.getElementById('registerForm');


form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    const result = await response.json();
    if (result.status === "success") {
        Swal.fire({
            title: "Se realizo el registro correctamente!",
            icon: "success",
            position: "top-end",
        }).then((res) => {
            if (res.isConfirmed) {
                window.location.replace('/login');
            }
        });
    }
})
