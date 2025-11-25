window.onload = function () {
    document.getElementById("producto").value = localStorage.getItem("producto");
    document.getElementById("monto").value = localStorage.getItem("precio");
};

const metodo = document.getElementById("metodo");
const qrBox = document.getElementById("qrBox");

metodo.addEventListener("change", function () {
    qrBox.style.display = metodo.value === "QR" ? "block" : "none";
});

document.getElementById("formPago").addEventListener("submit", function (e) {
    e.preventDefault();

    let prod = document.getElementById("producto").value;
    let monto = document.getElementById("monto").value;
    let cliente = document.getElementById("cliente").value;
    let metodoPago = metodo.value;

    if (cliente.trim() === "") {
        alert("Ingrese su nombre.");
        return;
    }

    // ENVÍO A WHATSAPP
    let mensaje = `*COMPROBAR PAGO*\n\nCliente: ${cliente}\nProducto: ${prod}\nMonto: ${monto} Bs\nMétodo: ${metodoPago}`;
    let url = `https://wa.me/59170906838?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

    alert("Pago realizado correctamente.");
});
