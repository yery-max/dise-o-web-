function cambiarTema(modo) {
    const root = document.documentElement; // para cambiar variables CSS

    if (modo === 'dia') {
        // colores originales de tu sitio
        root.style.setProperty('--p1', '#C28893');
        root.style.setProperty('--p2', '#D9A6AE');
        root.style.setProperty('--bg1', '#E8D5C4');
        root.style.setProperty('--bg2', '#F3E8DD');
        root.style.setProperty('--muted', '#D7B7B8');
        root.style.setProperty('--accent1', '#B9C7B9');
        root.style.setProperty('--accent2', '#8F9E8F');
        root.style.setProperty('--dark1', '#6F3841');
        root.style.setProperty('--dark2', '#4D1B24');

        document.body.style.background = `linear-gradient(var(--bg1), var(--bg2))`;
        document.body.style.color = 'var(--dark1)';
    }

    if (modo === 'noche') {
        // colores oscuros, más sobrios
        root.style.setProperty('--p1', '#6F3841');
        root.style.setProperty('--p2', '#4D1B24');
        root.style.setProperty('--bg1', '#1c1b1b');
        root.style.setProperty('--bg2', '#2b2a2a');
        root.style.setProperty('--muted', '#555555');
        root.style.setProperty('--accent1', '#888888');
        root.style.setProperty('--accent2', '#AAAAAA');
        root.style.setProperty('--dark1', '#FFFFFF');
        root.style.setProperty('--dark2', '#DDDDDD');

        document.body.style.background = `linear-gradient(var(--bg1), var(--bg2))`;
        document.body.style.color = 'var(--dark1)';
    }

    if (modo === 'daltonico') {
        // esquema amigable para daltonismo (amarillos/azules en vez de rojos)
        root.style.setProperty('--p1', '#FFD700'); // dorado
        root.style.setProperty('--p2', '#FFEB3B'); // amarillo
        root.style.setProperty('--bg1', '#FFF9C4'); // fondo claro
        root.style.setProperty('--bg2', '#FFF59D'); // fondo secundario
        root.style.setProperty('--muted', '#FFE082'); // bordes/apagados
        root.style.setProperty('--accent1', '#FFECB3'); // acentos
        root.style.setProperty('--accent2', '#FFF176'); // acentos secundarios
        root.style.setProperty('--dark1', '#333300'); // texto principal
        root.style.setProperty('--dark2', '#4D4D00'); // texto secundario

        document.body.style.background = `linear-gradient(var(--bg1), var(--bg2))`;
        document.body.style.color = 'var(--dark1)';
    }
}


document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.slider');
  const navLinks = Array.from(document.querySelectorAll('.slider-nav a'));
  const slides = Array.from(slider.children); // tus <a> con <img>

  // Si no hay elementos, salir
  if (!slider || slides.length === 0 || navLinks.length === 0) return;

  // Al hacer click en cada punto, prevenir el comportamiento por defecto
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // evita que el navegador baje la página
      // desplazar el contenedor horizontalmente hasta la posición del slide
      slider.scrollTo({
        left: slides[idx].offsetLeft,
        behavior: 'smooth'
      });
      // marcar el punto activo
      navLinks.forEach(n => n.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Actualizar punto activo cuando el usuario hace scroll manualmente (arrastrando)
  let rafId = null;
  slider.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const scrollLeft = slider.scrollLeft;
      // encontrar el slide más cercano
      let closestIndex = 0;
      let minDiff = Infinity;
      slides.forEach((s, i) => {
        const diff = Math.abs(s.offsetLeft - scrollLeft);
        if (diff < minDiff) { minDiff = diff; closestIndex = i; }
      });
      navLinks.forEach(n => n.classList.remove('active'));
      if (navLinks[closestIndex]) navLinks[closestIndex].classList.add('active');
    });
  });

  // Inicial: marca el primer punto
  navLinks.forEach(n => n.classList.remove('active'));
  navLinks[0].classList.add('active');
});

// Autoplay por slide (cada X segundos)
(function () {
  const slider = document.querySelector('.slider');
  const slides = Array.from(slider.children);
  const navLinks = Array.from(document.querySelectorAll('.slider-nav a'));
  if (!slider || slides.length === 0) return;

  let current = 0;
  const delay = 2700; // ms entre slides (cambia a tu gusto)
  let timerId = null;

  function goTo(index, smooth = true) {
    index = (index + slides.length) % slides.length;
    current = index;
    slider.scrollTo({ left: slides[index].offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
    navLinks.forEach(n => n.classList.remove('active'));
    if (navLinks[index]) navLinks[index].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() {
    stop();
    timerId = setInterval(next, delay);
  }
  function stop() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  // pausar al hover/focus (mejor UX)
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  // iniciar
  start();

  // sincroniza si el usuario hace scroll manual
  slider.addEventListener('scroll', () => {
    // pequeño debounce con requestAnimationFrame
    if (window._carouselRAF) cancelAnimationFrame(window._carouselRAF);
    window._carouselRAF = requestAnimationFrame(() => {
      const scrollLeft = slider.scrollLeft;
      let closest = 0, minDiff = Infinity;
      slides.forEach((s, i) => {
        const diff = Math.abs(s.offsetLeft - scrollLeft);
        if (diff < minDiff) { minDiff = diff; closest = i; }
      });
      current = closest;
      navLinks.forEach(n => n.classList.remove('active'));
      if (navLinks[closest]) navLinks[closest].classList.add('active');
    });
  });

  // si usas ya el código de click en nav, asegúrate de llamar a goTo() desde ahí en vez de scrollTo directo
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(idx);
    });
  });

})();
