function mostrarCategoria(id) {
    // Ocultar todas
    const categorias = document.querySelectorAll(".galeria");
    categorias.forEach(cat => cat.classList.remove("categoria-activa"));

    // Mostrar solo la seleccionada
    document.getElementById(id).classList.add("categoria-activa");
}
