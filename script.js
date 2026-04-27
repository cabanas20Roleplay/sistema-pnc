// Configuración de Roles con Permisos de Edición
const ROLES_ADMIN = ["1482514166378922216", "1495568283926265877"]; // Fundador y Oficial

function loginWithDiscord() {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1473860253652226292&response_type=token&redirect_uri=https%3A%2F%2Fcabanas20roleplay.github.io%2Fsistema-pnc%2F&scope=identify+guilds";
}

window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has("access_token")) {
        const accessToken = fragment.get("access_token");

        // 1. Obtener datos del usuario
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(user => {
            // 2. Obtener los roles del usuario en el servidor (Guild Member)
            // NOTA: Para esto el bot necesita estar en el servidor
            fetch(`https://discord.com/api/users/@me/guilds/TU_SERVER_ID/member`, {
                headers: { authorization: `Bearer ${accessToken}` }
            })
            .then(res => res.json())
            .then(memberData => {
                const isStaff = memberData.roles.some(role => ROLES_ADMIN.includes(role));
                loadDashboard(user.id, isStaff);
            });
        });
    }
};

function loadDashboard(userId, isStaff) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    if (isStaff) {
        document.getElementById("admin-panel").classList.remove("hidden");
        console.log("ACCESO DE OFICIAL CONCEDIDO");
    }

    // Cargar datos de Firebase...
    fetch(`https://pnc-cabanas-default-rtdb.firebaseio.com/usuarios/${userId}.json`)
    .then(res => res.json())
    .then(data => {
        // Rellenar campos (Nombre, Dinero, etc)
    });
}
