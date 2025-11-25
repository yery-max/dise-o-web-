/* ===== Lógica del Chatbot (simple, local) ===== */
const nombreInput = document.getElementById('Nombre');
const mensajeInput = document.getElementById('Mensaje');
const mensajesBox = document.getElementById('Mensajes');
const sendBtn = document.getElementById('sendBtn');
const catalogoBtn = document.getElementById('catalogoBtn');
const toggleSugs = document.getElementById('toggleSugs');
const panelContent = document.getElementById('panelContent');

// Abre enlace del catálogo (ruta corregida)
catalogoBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  window.open('pago/paginas/catalogo.html', '_blank'); // ruta correcta desde chat.html
  agregaMensaje('bot', 'Puedes ver nuestro catálogo haciendo clic en el botón "Catálogo" arriba.');
});

// Toggle colapsable
toggleSugs.addEventListener('click', ()=>{
  const expanded = toggleSugs.getAttribute('aria-expanded') === 'true';
  toggleSugs.setAttribute('aria-expanded', String(!expanded));
  panelContent.style.maxHeight = expanded ? '0' : panelContent.scrollHeight + 'px';
  // cambiar flecha
  toggleSugs.querySelector('span').textContent = expanded ? '▾' : '▴';
});

// Enviar con Enter
mensajeInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') {
    e.preventDefault();
    procesaEnvio();
  }
});

sendBtn.addEventListener('click', procesaEnvio);

// Botones rápidos
document.querySelectorAll('.quick-btn[data-msg]').forEach(b=>{
  b.addEventListener('click', ()=>{
    procesaEnvio(b.getAttribute('data-msg'));
  });
});

// Botón ver catálogo dentro de sugerencias
document.getElementById('openCatalogFromSugs').addEventListener('click', ()=>{
  catalogoBtn.click();
});

function procesaEnvio(texto=null){
  const nombre = nombreInput.value.trim() || 'Amigo';
  const contenido = texto !== null ? texto : mensajeInput.value.trim();
  if(!contenido) return;
  // Mostrar mensaje usuario
  agregaMensaje('user', contenido, nombre);
  // limpiar input solo si vino por input
  if(texto === null) mensajeInput.value = '';
  // generar respuesta
  setTimeout(()=>{
    const r = respuestaBot(contenido, nombre);
    agregaMensaje('bot', r);
  }, 240); // pequeño delay para sensación de "respuesta"
}

function agregaMensaje(tipo, texto, usuario){
  const cont = document.createElement('div');
  cont.className = 'msg ' + (tipo === 'user' ? 'user' : 'bot');
  if(tipo === 'user'){
    cont.innerHTML = `<div style="font-size:12px;opacity:0.8;margin-bottom:6px;"><strong>${escapeHtml(usuario || 'Tú')}</strong></div>
                     <div>${escapeHtml(texto)}</div>`;
  } else {
    cont.innerHTML = `<div>${escapeHtml(texto)}</div>`;
  }
  mensajesBox.appendChild(cont);
  mensajesBox.scrollTop = mensajesBox.scrollHeight;
}

// Respuestas predefinidas (adaptadas a tus productos)
function respuestaBot(mensaje, usuario){
  const msg = mensaje.trim().toUpperCase();
  const map = {
    '¿QUÉ SON LAS FLORES ETERNAS?': `Son arreglos hechos con materiales sintéticos de alta calidad (foam, seda artificial y plástico) que imitan flores reales y duran muchos años.`,
    '¿DE QUÉ MATERIAL ESTÁN HECHAS?': `Nuestras flores están fabricadas con foam, seda sintética y plástico premium, diseñadas para verse muy reales y conservar su forma y color.`,
    '¿CUÁNTO DURAN LAS FLORES ETERNAS?': `Pueden durar años si se mantienen en un lugar seco y sin sol directo.`,
    '¿REQUIEREN CUIDADOS?': `No necesitan agua. Recomendamos limpieza suave con un paño seco o aire comprimido de vez en cuando.`,
    '¿CÓMO VIENEN PRESENTADAS?': `Vienen en cajas premium, domos acrílicos o bases decorativas listas para regalar.`,
    '¿QUÉ TAMAÑOS DE PELUCHES TIENEN?': `Tenemos peluches desde 20 cm hasta 1 metro (según modelo y disponibilidad).`,
    '¿PUEDO PERSONALIZAR UN PELUCHE?': `Sí. Podemos agregar tarjetas, nombres bordados o cintas según el modelo.`,
    '¿QUÉ ME RECOMIENDAN PARA ANIVERSARIO?': `Los más pedidos son: rosa eterna en domo, box romántico con peluche y chocolates, o un bouquet personalizado.`,
    '¿PUEDO AGREGAR UNA DEDICATORIA?': `Sí, incluye tu dedicatoria y la añadimos sin costo adicional.`,
    '¿TIENEN CENTROS DE MESA PARA GRADUACIÓN?': `Sí, disponemos de centros con flores artificiales, mini peluches, globos personalizados y colores según la carrera.`,
    '¿SE PUEDEN PERSONALIZAR LOS CENTROS DE MESA?': `Sí: nombre del graduado, fecha, frase y colores a elección.`,
    '¿HACEN ENTREGAS A DOMICILIO?': `Sí, entregamos en toda la ciudad. El costo depende de la zona. Pulsa "Catálogo" para ver disponibilidad por producto.`,
    '¿PUEDO PEDIR PARA HOY?': `No, el pedido debe realizarse con 2 días de anticipación.`,
    '¿QUÉ MÉTODOS DE PAGO ACEPTAN?': `Aceptamos efectivo, QR y transferencias.`,
    '¿CÓMO HAGO UN PEDIDO?': `Elige un producto en el botón "Catálogo" y selecciona el que deseas.`,
    'CATÁLOGO': `Puedes revisar nuestro catálogo haciendo clic en el botón "Catálogo" arriba.`,
    'HOLA': `Hola ${usuario}, ¿en qué puedo ayudarte hoy?`,
    'QUE TAL': `Todo bien, ${usuario}. ¿Qué buscas?`,
    'COMO ESTAS': `Bien, gracias. ¿En qué puedo ayudarte?`,
    'CHAU': `¡Hasta luego ${usuario}! Gracias por visitarnos.`,
  };

  if(map[msg]) return map[msg];

  // coincidencias parciales
  if(msg.includes('CATALOGO') || msg.includes('CATÁLOGO')) return map['CATÁLOGO'];
  if(msg.includes('FLORES') || msg.includes('ETERNAS')) return map['¿QUÉ SON LAS FLORES ETERNAS?'];
  if(msg.includes('PELUCHE')) return map['¿QUÉ TAMAÑOS DE PELUCHES TIENEN?'];
  if(msg.includes('GRADU') || msg.includes('CENTRO')) return map['¿TIENEN CENTROS DE MESA PARA GRADUACIÓN?'];
  if(msg.includes('ENVI') || msg.includes('DOMICILIO')) return map['¿HACEN ENTREGAS A DOMICILIO?'];
  if(msg.includes('PAGO') || msg.includes('PAGAR')) return map['¿QUÉ MÉTODOS DE PAGO ACEPTAN?'];

  // fallback simpático
  return `Lo siento, no entendí exactamente: "${mensaje}". Puedes usar los botones de sugerencias o presionar "Catálogo".`;
}

// pequeña función para escapar HTML en mensajes
function escapeHtml(unsafe) {
  return unsafe
     .replaceAll('&','&amp;')
     .replaceAll('<','&lt;')
     .replaceAll('>','&gt;')
     .replaceAll('"','&quot;')
     .replaceAll("'",'&#039;');
}

// Mensaje de bienvenida
window.addEventListener('load', ()=>{
  agregaMensaje('bot', '¡Hola! Soy tu asistente. Pulsa "Sugerencias rápidas" para ver opciones o "Catálogo" para elegir productos.');
});

