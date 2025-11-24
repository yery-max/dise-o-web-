function seleccionarProducto(nombre, precio) {
    localStorage.setItem("producto", nombre);
    localStorage.setItem("precio", precio);
    window.location.href = "pago.html";
}
