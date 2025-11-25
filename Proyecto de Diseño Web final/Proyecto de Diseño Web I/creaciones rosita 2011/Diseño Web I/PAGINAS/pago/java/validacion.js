// carrito-con-fecha-mapa.js
document.addEventListener('DOMContentLoaded', () => {

  // --- CARGA Y MOSTRAR CARRITO (igual que antes) ---
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const detalleDiv = document.getElementById("detalle-carrito");
  let total = 0;

  function mostrarCarrito() {
    if (!detalleDiv) return;
    detalleDiv.innerHTML = "";
    total = 0;

    if (carrito.length === 0) {
      detalleDiv.innerHTML = "<p>Carrito vacío.</p>";
      const td = document.getElementById("totalDiv");
      if (td) td.innerHTML = "";
      return;
    }

    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const row = document.createElement("div");
      row.className = "carrito-row";
      row.innerHTML = `
        <label style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(255,255,255,0.7);border-radius:8px;margin-bottom:8px;">
          <input type="checkbox" class="chk-delete" data-index="${index}">
          <div style="flex:1;">
            <div><strong>${index+1}. ${item.nombre}</strong></div>
            <div>Precio unitario: ${item.precio} Bs</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
            <input type="number" min="1" value="${item.cantidad}" data-index="${index}" class="qty-input" style="width:80px;padding:6px;border-radius:6px;border:1px solid #ccc;">
            <div>Subtotal: <span class="subtot">${subtotal}</span> Bs</div>
            <button type="button" class="btn secondary btn-eliminar" data-index="${index}">Eliminar</button>
          </div>
        </label>
      `;
      detalleDiv.appendChild(row);
    });

    const totalDiv = document.getElementById("totalDiv");
    if (totalDiv) totalDiv.innerHTML = `<h3>Total: ${total} Bs</h3>`;

    // listeners cantidad
    document.querySelectorAll('.qty-input').forEach(inp => {
      inp.addEventListener('change', function () {
        const idx = parseInt(this.dataset.index, 10);
        let q = parseInt(this.value, 10);
        if (isNaN(q) || q < 1) q = 1;
        carrito[idx].cantidad = q;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
      });
    });

    // listeners eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.dataset.index, 10);
        eliminarItem(idx);
      });
    });
  }

  function eliminarItem(idx) {
    if (!confirm("Eliminar este item del carrito?")) return;
    carrito.splice(idx, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }

  function eliminarSeleccionados() {
    const checks = document.querySelectorAll('.chk-delete');
    let nuevo = [];
    checks.forEach((chk) => {
      const idx = parseInt(chk.dataset.index, 10);
      if (!chk.checked && carrito[idx]) nuevo.push(carrito[idx]);
    });
    carrito = nuevo;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }

  function vaciarCarrito() {
    if (!confirm("Vaciar todo el carrito?")) return;
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
  }

  const btnVaciar = document.getElementById("btn-vaciar");
  if (btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);

  const btnEliminarSel = document.getElementById("btn-eliminar-seleccionados");
  if (btnEliminarSel) btnEliminarSel.addEventListener('click', eliminarSeleccionados);

  // mostrar inicial
  mostrarCarrito();

  // --- MANEJO METODO, QR, FECHA Y MAPA ---
  const metodo = document.getElementById("metodo");
  const qrBox = document.getElementById("qrBox");
  const fechaBox = document.getElementById("fechaBox");
  const fechaInput = document.getElementById("fechaEntrega");
  const mapBox = document.getElementById("mapBox");
  const mapContainer = document.getElementById("mapContainer");

  // La short link que diste:
  const shortMapLink = "https://maps.app.goo.gl/WgjcsoBjcq67psSh6";

  // Función para calcular fecha mínima (hoy + 3 días) y formatear yyyy-mm-dd
  function calcularMinFechaDias(dias = 3) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    // formatear YYYY-MM-DD (ajusta a zona local)
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // crear iframe del mapa (solo con esa ubicación y pin)
 // Reemplaza tu función crearIframeMapa() por esta versión:
function crearIframeMapa() {
  const lat = -17.8224088;
  const lng = -63.1458503;
  const shortMapLink = "https://maps.app.goo.gl/DEtBkr3PdTVLBhPY8";

  if (!mapContainer) return;
  mapContainer.innerHTML = "";

  const iframe = document.createElement('iframe');
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = "0";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";

  // Usamos la consulta q=lat,lng para mostrar el pin centrado
  iframe.src = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;

  // Si por alguna razón el iframe falla, mostramos un enlace como fallback
  iframe.addEventListener('error', () => {
    mapContainer.innerHTML = `
      <p>No se pudo incrustar el mapa. Abra el punto de entrega en Google Maps:</p>
      <p><a href="${shortMapLink}" target="_blank" rel="noopener noreferrer">${shortMapLink}</a></p>
    `;
  });

  mapContainer.appendChild(iframe);
}


  // Ocultar todos por defecto y asegurar select en "Seleccionar"
  if (metodo) metodo.value = "";
  if (qrBox) qrBox.style.display = "none";
  if (fechaBox) fechaBox.style.display = "none";
  if (mapBox) mapBox.style.display = "none";

  // Listener al cambiar método
  if (metodo) {
    metodo.addEventListener('change', () => {
      const val = metodo.value;
      if (val === "QR") {
        // mostrar solo QR
        if (qrBox) qrBox.style.display = "block";
        if (fechaBox) fechaBox.style.display = "none";
        if (mapBox) mapBox.style.display = "none";
      } else if (val === "EFECTIVO") {
        // mostrar calendario y mapa
        if (qrBox) qrBox.style.display = "none";
        if (fechaBox) fechaBox.style.display = "block";
        if (mapBox) mapBox.style.display = "block";

        // configurar fecha mínima y valor por defecto
        if (fechaInput) {
          const minFecha = calcularMinFechaDias(3);
          fechaInput.min = minFecha;

          // si no tiene valor o el valor actual es menor que el mínimo, setearlo
          if (!fechaInput.value || fechaInput.value < minFecha) {
            fechaInput.value = minFecha;
          }
        }

        // insertar mapa (si aún no existe)
        crearIframeMapa();
      } else {
        // opción por defecto -> ocultar todo
        if (qrBox) qrBox.style.display = "none";
        if (fechaBox) fechaBox.style.display = "none";
        if (mapBox) mapBox.style.display = "none";
      }
    });
  }

  // --- FORM SUBMIT: validación y comprobante (incluye fecha y referencia de ubicación) ---
  const form = document.getElementById("formPago");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const clienteEl = document.getElementById("cliente");
      const cliente = clienteEl ? clienteEl.value.trim() : "";
      const metodoPago = metodo ? metodo.value : "";

      if (!cliente || !metodoPago) {
        alert("Complete todos los campos (nombre y método).");
        return;
      }
      if (carrito.length === 0) {
        alert("Carrito vacío.");
        return;
      }

      // Si es EFECTIVO, validar que la fecha sea >= min (por seguridad)
      if (metodoPago === "EFECTIVO" && fechaInput) {
        const minFecha = fechaInput.min || calcularMinFechaDias(3);
        if (!fechaInput.value || fechaInput.value < minFecha) {
          alert(`Seleccione una fecha válida. La fecha mínima permitida es ${minFecha}.`);
          return;
        }
      }

      // preparar comprobante DOM
      const listaDiv = document.getElementById("comp-lista");
      if (listaDiv) listaDiv.innerHTML = "";
      let textoLista = "";
      carrito.forEach((it, idx) => {
        const subtotal = it.precio * it.cantidad;
        if (listaDiv) listaDiv.innerHTML += `<p>${idx + 1}. ${it.nombre} — ${it.cantidad} x ${it.precio} Bs = ${subtotal} Bs</p>`;
        textoLista += `${idx + 1}. ${it.nombre} — ${it.cantidad} x ${it.precio} Bs = ${subtotal} Bs\n`;
      });

      const compTotal = document.getElementById("comp-total");
      if (compTotal) compTotal.innerText = `TOTAL: ${total} Bs`;

      const compMetodo = document.getElementById("comp-metodo");
      if (compMetodo) compMetodo.innerText = `Método: ${metodoPago}`;

      const compFecha = document.getElementById("comp-fecha");
      if (compFecha) {
        if (metodoPago === "EFECTIVO" && fechaInput && fechaInput.value) {
          compFecha.innerText = `Fecha de entrega: ${fechaInput.value}`;
        } else {
          compFecha.innerText = `Fecha: ${new Date().toLocaleString()}`;
        }
      }

      // qr dentro del comprobante si corresponde
      const compQrDiv = document.getElementById("comp-qr");
      if (compQrDiv) compQrDiv.innerHTML = "";
      if (metodoPago === "QR" && compQrDiv) {
        compQrDiv.innerHTML = `<img src="../imagen/qr.jpeg" alt="QR" style="max-width:240px;display:block;margin:8px 0;">`;
      }

      // añadir referencia del punto de entrega siempre cuando efectivo
      const compLugar = document.getElementById("comp-lugar");
      if (compLugar) {
        if (metodoPago === "EFECTIVO") {
          compLugar.innerHTML = `Punto de entrega (fijo): <a href="${shortMapLink}" target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>`;
        } else {
          compLugar.innerHTML = "";
        }
      }

      // Mostrar comprobante (necesario para html2pdf)
      const comprobante = document.getElementById("comprobante");
      if (comprobante) comprobante.classList.remove("oculto");

      const opt = {
        margin: 10,
        filename: `comprobante_${cliente.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(comprobante).save().then(() => {
        // preparar mensaje de WhatsApp, incluir fecha de entrega y la referencia del punto
        let mensaje = `Comprobar Pago - Creaciones Rosita\nCliente: ${cliente}\n`;
        carrito.forEach(it => {
          mensaje += `${it.nombre} — ${it.cantidad} x ${it.precio} Bs = ${it.precio * it.cantidad} Bs\n`;
        });
        mensaje += `\nTOTAL: ${total} Bs\nMétodo: ${metodoPago}\n`;

        if (metodoPago === "EFECTIVO" && fechaInput && fechaInput.value) {
          mensaje += `Fecha de entrega: ${fechaInput.value}\n`;
          mensaje += `Punto de entrega: ${shortMapLink}\n`;
        } else {
          mensaje += `Fecha: ${new Date().toLocaleString()}\n`;
        }

        mensaje += `\nGracias por su compra 🌸`;

        const telFijo = "59170906838";
        window.open(`https://wa.me/${telFijo}?text=${encodeURIComponent(mensaje)}`, '_blank');

        // limpiar carrito y volver
        localStorage.removeItem("carrito");
        alert("Pago registrado. Comprobante generado y chat de WhatsApp abierto para enviar.");
        window.location.href = "index.html";
      }).catch(err => {
        console.error(err);
        alert("Error generando PDF. Intente nuevamente.");
      }).finally(() => {
        if (comprobante) comprobante.classList.add("oculto");
      });

    });
  }

  // Exponer funciones globales si usas llamadas inline en HTML
  window.eliminarItem = eliminarItem;
  window.vaciarCarrito = vaciarCarrito;
  window.eliminarSeleccionados = eliminarSeleccionados;

}); // end DOMContentLoaded


