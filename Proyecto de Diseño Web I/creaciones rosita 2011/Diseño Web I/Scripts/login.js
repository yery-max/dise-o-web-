// login.js
const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");

// Usuarios válidos (se dejan como están)
const usuarios = [
 { username: "mariana", password: "campos" }, 
{ username: "yery", password: "torrico" },  
{ username: "rosa", password: "salvatierra" },
  { username: "julio", password: "cesar" }
];

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  error.textContent = "";

  // Convertir lo ingresado a minúsculas
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim().toLowerCase();

  // Comparar convirtiendo también los almacenados a minúsculas
  const usuarioValido = usuarios.find(
    u => u.username.toLowerCase() === username && u.password.toLowerCase() === password
  );

  if (usuarioValido) {
    window.location.href = "home.html";
  } else {
    error.textContent = "Usuario o contraseña incorrectos.";
  }
}); 	
