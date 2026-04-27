const SERVER_ID = "1398924559452864573";
const DB_URL = "https://pnc-cabanas-default-rtdb.firebaseio.com/usuarios";

// JERARQUÍA DE ROLES
const PERMISOS = {
    TOTAL: ["1482514166378922216", "1456365590158512382", "1482515647647846480"], // Fundador, Bots, Admin
    STAFF: ["1455809626854523101", "1455809625768071179"], // Staff Oficial, Prueba
    PNC: ["1495568283926265877"] // Oficiales
};

let userRole = "ciudadano";

function loginWithDiscord() {
    // Usamos el nuevo link de OAuth2 generado por ti
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1473860253652226292&response_type=token&redirect_uri=https%3A%2F%2Fcabanas20roleplay.github.io%2Fsistema-pnc%2F&scope=identify+guilds.members.read+guilds+email";
}

window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has("access_token")) {
        const token = fragment.get("access_token");
        
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(user => {
            // Verificar rango en el servidor
            fetch(`https://discord.com/api/users/@me/guilds/${SERVER_ID}/member`, {
                headers: { authorization: `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(member => {
                const roles = member.roles || [];
                setAccessLevel(roles, user);
                cargarDatos(user.id);
            });
        });
    }
};

function setAccessLevel(roles, user) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("user-name").innerText = user.username.toUpperCase();
    document.getElementById("user-avatar").src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

    const badge = document.getElementById("access-level");

    if (roles.some(r => PERMISOS.TOTAL.includes(r))) {
        userRole = "total";
        badge.innerText = "ACCESO TOTAL / FUNDADOR";
        badge.className = "badge total";
        document.getElementById("admin-panel").classList.remove("hidden");
    } else if (roles.some(r => PERMISOS.STAFF.includes(r))) {
        userRole = "staff";
        badge.innerText = "STAFF ADMINISTRATIVO";
        badge.className = "badge staff";
        document.getElementById("admin-panel").classList.remove("hidden");
    } else if (roles.some(r => PERMISOS.PNC.includes(r))) {
        userRole = "pnc";
        badge.innerText = "UNIDAD POLICIAL";
        badge.className = "badge pnc";
        document.getElementById("admin-panel").classList.remove("hidden");
    }
}

// Lógica de búsqueda y guardado (Respetando permisos)
function buscarCiudadano() {
    const id = document.getElementById("search-id").value;
    fetch(`${DB_URL}/${id}.json`).then(res => res.json()).then(data => {
        if (!data) return alert("Ciudadano no encontrado.");
        
        document.getElementById("editor-form").classList.remove("hidden");
        
        // Bloquear campos si es solo PNC
        if (userRole === "pnc") {
            document.getElementById("edit-name").disabled = true;
            document.getElementById("edit-cash").disabled = true;
            document.getElementById("edit-bank").disabled = true;
        }

        // Mostrar botón borrar solo a Fundadores
        if (userRole === "total") {
            document.getElementById("btn-delete").classList.remove("hidden");
        }
        
        // Cargar valores en inputs...
    });
}
