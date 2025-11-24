// Carrito en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Agregar producto
function agregarProductoConCantidad(nombre, precio, btn){
  const input = btn.parentElement.querySelector('.prod-cant');
  let cantidad = parseInt(input.value) || 1;
  if (cantidad < 1) cantidad = 1;

  const existeIdx = carrito.findIndex(it => it.nombre === nombre);
  if (existeIdx !== -1) {
    carrito[existeIdx].cantidad += cantidad;
  } else {
    carrito.push({nombre, precio, cantidad});
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${nombre} (${cantidad}) agregado al carrito. Total items: ${carrito.length}`);
}

// Ir al pago
function irAlPago(){
  if(carrito.length === 0){
    alert("Tu carrito está vacío. Agrega productos antes de pagar.");
    return;
  }
  window.location.href = "pago.html";
}

// Ver carrito
function verCarrito(){
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if(carrito.length === 0){ alert("Carrito vacío"); return;}
  let txt = "Carrito:\n";
  let total = 0;
  carrito.forEach((it,i)=> { 
    txt += `${i+1}. ${it.nombre} - ${it.precio} Bs x ${it.cantidad} = ${it.precio*it.cantidad} Bs\n`; 
    total += it.precio*it.cantidad;
  });
  txt += `\nTotal: ${total} Bs`;
  alert(txt);
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementsByClassName('close')[0];

document.querySelectorAll('.img-click').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

// Cerrar lightbox
closeBtn.onclick = function() {
  lightbox.style.display = 'none';
}

// Cerrar al hacer clic fuera de la imagen
lightbox.onclick = function(e) {
  if(e.target === lightbox) {
    lightbox.style.display = 'none';
  }
}
