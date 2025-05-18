const comidasBuenas = ["torta", "hamburguesa", "pizza", "pollo frito", "helado"];
const comidasMalas = ["popó de caballo", "piedra", "agua sucia", "basura", "zapato viejo"];

let nombres = [];
let jugadorActual = 0;
let victorias = [];
let historial = [];
let comidas = [];
let juegoTerminado = false;

function mostrarFormularioNombres() {
  const input = document.getElementById("num-jugadores").value;
  const mensajeError = document.getElementById("mensaje-error");
  const num = parseInt(input);

  if (isNaN(num) || num < 1 || num > 3) {
    mensajeError.textContent = "Debe ser entre 1 y 3 jugadores.";
    return;
  }

  mensajeError.textContent = "";
  const form = document.getElementById("form-nombres");
  form.innerHTML = "";

  for (let i = 0; i < num; i++) {
    form.innerHTML += `
      <label>Jugador ${i + 1}:</label><br>
      <input type="text" id="jugador-${i}" required><br><br>
    `;
  }

  document.getElementById("pantalla-inicio").classList.remove("visible");
  document.getElementById("pantalla-nombres").classList.add("visible");
}

function iniciarJuego() {
  const form = document.getElementById("form-nombres");
  const inputs = form.querySelectorAll("input");
  nombres = [];

  for (let input of inputs) {
    if (input.value.trim() === "") {
      alert("Todos los jugadores deben tener nombre.");
      return;
    }
    nombres.push(input.value.trim());
  }

  victorias = Array(nombres.length).fill(0);
  historial = Array(nombres.length).fill(null).map(() => []);
  comidas = Array(15).fill("buena").concat(Array(15).fill("mala"));
  comidas = comidas.sort(() => Math.random() - 0.5);

  document.getElementById("pantalla-nombres").classList.remove("visible");
  document.getElementById("pantalla-juego").classList.add("visible");
  actualizarPantalla();
}

function actualizarPantalla() {
  document.getElementById("jugador-actual").textContent = nombres[jugadorActual];
  document.getElementById("resultado-turno").textContent = "";
  document.getElementById("estado-jugadores").textContent =
    nombres.map((n, i) => `${n}: ${victorias[i]} buenas`).join(" | ");
  mostrarHistorial();
}

function elegirComer(decideComer) {
  if (juegoTerminado) return;

  if (!decideComer) {
    document.getElementById("resultado-turno").textContent = "Decidiste no comer. Perdiste el turno. ❌";
    pasarTurno();
    return;
  }

  if (comidas.length === 0) {
    finalizarJuego("Se acabaron las comidas. Nadie ganó.");
    return;
  }

  const tipo = comidas.pop();
  let comida;

  if (tipo === "buena") {
    comida = comidasBuenas[Math.floor(Math.random() * comidasBuenas.length)];
    const mensajesBuenos = [
      `¡Genial! Comiste ${comida} y estaba delicioso 😋`,
      `¡Qué suerte! Disfrutaste de ${comida} 🎉`,
      `¡Ñam ñam! ${comida} fue una gran elección 🍰`
    ];

    victorias[jugadorActual]++;
    historial[jugadorActual].push(comida);

    document.getElementById("mensaje-bueno").textContent =
      mensajesBuenos[Math.floor(Math.random() * mensajesBuenos.length)];

    document.getElementById("pantalla-juego").classList.remove("visible");
    document.getElementById("pantalla-buena").classList.add("visible");

    if (victorias[jugadorActual] >= 3) {
      finalizarJuego(`🎉 ¡${nombres[jugadorActual]} ganó comiendo 3 comidas buenas! 🎉`);
    }

  } else {
    comida = comidasMalas[Math.floor(Math.random() * comidasMalas.length)];
    historial[jugadorActual].push(comida);

    document.getElementById("mensaje-mala").textContent = `Oh no... comiste ${comida} 😢`;

    document.getElementById("pantalla-juego").classList.remove("visible");
    document.getElementById("pantalla-mala").classList.add("visible");
  }
}

function continuarJuego() {
  document.getElementById("pantalla-mala").classList.remove("visible");
  document.getElementById("pantalla-buena").classList.remove("visible");
  jugadorActual = (jugadorActual + 1) % nombres.length;
  actualizarPantalla();
  document.getElementById("pantalla-juego").classList.add("visible");
}

function pasarTurno() {
  jugadorActual = (jugadorActual + 1) % nombres.length;
  actualizarPantalla();
}

function mostrarHistorial() {
  let html = "<h3>Historial de comidas</h3>";
  for (let i = 0; i < nombres.length; i++) {
    html += `<p><strong>${nombres[i]}</strong>: ${historial[i].join(", ")}</p>`;
  }
  document.getElementById("historial").innerHTML = html;
}

function finalizarJuego(mensaje) {
  juegoTerminado = true;
  document.getElementById("pantalla-juego").classList.remove("visible");
  document.getElementById("pantalla-mala").classList.remove("visible");
  document.getElementById("pantalla-buena").classList.remove("visible");
  document.getElementById("pantalla-final").classList.add("visible");
  document.getElementById("mensaje-final").textContent = mensaje;
}
