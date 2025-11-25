// Traducciones
const traducciones = {
    es: {
        "language-btn": "LENGUAJE",
        "theme-btn": "TEMAS",
        "theme-dia-opt": "DÍA",
        "theme-noche-opt": "NOCHE",
        "btn-login": "CHATBOT",
	"btn-CATALOGO": "CATALOGO",

        "titulo-historia": "HISTORIA",
        "texto-historia": 
            "Comenzamos este emprendimiento con la pasión de crear flores que nunca se marchiten. Cada pieza que creamos es única y especial, diseñada para preservar tus momentos más importantes para siempre. Trabajamos con materiales de la más alta calidad, dedicando tiempo y amor a cada detalle. Nuestras flores artesanales no solo son hermosas, sino que también cuentan una historia y transmiten emociones.",

        "titulo-vision": "VISIÓN",
        "texto-vision": 
            "Crea momentos especiales con detalles únicos hechos con rosas eternas, destacando calidad, originalidad y amor en cada entrega.",

        "footer-frase": "EL REGALO PERFECTO QUE DURA PARA SIEMPRE",
        "footer-contacto": "CONTÁCTANOS"
    },

    en: {
        "language-btn": "LANGUAGE",
        "theme-btn": "THEMES",
        "theme-dia-opt": "DAY",
        "theme-noche-opt": "NIGHT",
        "btn-login": "CHATBOT",
	"btn-CATALOGO": "CATALOG",

        "titulo-historia": "HISTORY",
        "texto-historia":
            "We started this project with the passion of creating flowers that never wither. Each piece we make is unique and special, designed to preserve your most important moments forever. We work with high-quality materials, dedicating time and love to every detail. Our handmade flowers are not only beautiful, but they also tell a story and convey emotions.",

        "titulo-vision": "VISION",
        "texto-vision":
            "Create special moments with unique details made with eternal roses, highlighting quality, originality, and love in every delivery.",

        "footer-frase": "THE PERFECT GIFT THAT LASTS FOREVER",
        "footer-contacto": "CONTACT US"
    }
};


// Función para cambiar idioma
function cambiarIdioma(lang) {
    const textos = traducciones[lang];

    for (let id in textos) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = textos[id];
    }
}


// Eventos
document.getElementById("lang-en").addEventListener("click", () => cambiarIdioma("en"));
document.getElementById("lang-es").addEventListener("click", () => cambiarIdioma("es"));
