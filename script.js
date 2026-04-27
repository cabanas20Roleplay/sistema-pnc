const CLIENT_ID = "1473860253652226292";
const REDIRECT_URI = "https://cabanas20roleplay.github.io/sistema-pnc/";

function loginDiscord() {
  const url = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify guilds`;
  window.location.href = url;
}
function getToken() {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}
async function getUser(token) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
const DB_URL = "https://pnc-cabanas-default-rtdb.firebaseio.com";

async function getUserData(discordId) {
  const res = await fetch(`${DB_URL}/usuarios/${discordId}.json`);
  return res.json();
}
window.onload = async () => {
  const token = getToken();
  if (!token) return;

  const user = await getUser(token);
  const data = await getUserData(user.id);

  if (!data) {
    alert("No estás registrado.");
    return;
  }

  startDashboard(user, data);
};
const ROLES = {
  admin: ["1482514166378922216"],
  staff: ["1455809626854523101"],
  oficial: ["1495568283926265877"]
};

function hasRole(userData, roleList) {
  return roleList.some(r => userData.roles.includes(r));
}
function startDashboard(user, data) {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  // Mostrar expedientes si es oficial
  if (hasRole(data, ROLES.oficial)) {
    document.getElementById("expedientes-btn").classList.remove("hidden");
  }

  loadModule("perfil", data);
}
function loadModule(module, data) {
  const content = document.getElementById("content");

  if (module === "perfil") {
    content.innerHTML = `
      <h1>${data.nombre}</h1>
      <p>Edad: ${data.edad}</p>
      <p>Roblox: ${data.roblox}</p>
    `;
  }

  if (module === "economia") {
    content.innerHTML = `
      <h1>Economía</h1>
      <p>Banco: $${data.banco}</p>
      <p>Efectivo: $${data.efectivo}</p>
    `;
  }

  if (module === "expedientes") {
    content.innerHTML = `
      <h1>Expedientes</h1>
      <button onclick="crearExpediente()">Crear</button>
      <div id="lista-exp"></div>
    `;
    cargarExpedientes();
  }
}
async function crearExpediente() {
  const nombre = prompt("Nombre del ciudadano:");
  const multa = prompt("Multa:");
  const evidencia = prompt("URL evidencia:");

  const exp = {
    nombre,
    multa,
    evidencia,
    fecha: Date.now()
  };

  await fetch(`${DB_URL}/expedientes.json`, {
    method: "POST",
    body: JSON.stringify(exp)
  });

  alert("Expediente creado");
}
async function cargarExpedientes() {
  const res = await fetch(`${DB_URL}/expedientes.json`);
  const data = await res.json();

  const cont = document.getElementById("lista-exp");
  cont.innerHTML = "";

  for (let id in data) {
    const exp = data[id];

    cont.innerHTML += `
      <div>
        <h3>${exp.nombre}</h3>
        <p>Multa: $${exp.multa}</p>
        <a href="${exp.evidencia}" target="_blank">Ver evidencia</a>
      </div>
    `;
  }
}
