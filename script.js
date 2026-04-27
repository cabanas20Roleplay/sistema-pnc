function loginWithDiscord() {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1473860253652226292&response_type=token&redirect_uri=https%3A%2F%2Fcabanas20roleplay.github.io%2Fsistema-pnc%2F&scope=identify+guilds+email";
}

window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));

    if (fragment.has("access_token")) {
        const accessToken = fragment.get("access_token");
        const tokenType = fragment.get("token_type");

        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `${tokenType} ${accessToken}` },
        })
        .then(res => res.json())
        .then(response => {
            const { username, id, avatar } = response;
            
            document.getElementById("login-section").classList.add("hidden");
            document.getElementById("dashboard").classList.remove("hidden");

            // Datos básicos de Discord
            document.getElementById("user-name").innerText = username.toUpperCase();
            document.getElementById("user-id").innerText = `EXPEDIENTE: #SV-${id.substring(0, 8)}`;
            document.getElementById("user-avatar").src = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512` : "https://cdn.discordapp.com/embed/avatars/1.png";

            // --- CONEXIÓN CON FIREBASE ---
            // Buscamos los datos del usuario en tu URL de Firebase
            fetch(`https://pnc-cabanas-default-rtdb.firebaseio.com/usuarios/${id}.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    // Si el usuario existe en Firebase, actualizamos la web con sus datos reales
                    updateField("balance-cash", `$${data.dinero || '0'}`);
                    updateField("balance-bank", `$${data.banco || '0'}`);
                    updateField("fines", `$${data.multas || '0'}`);
                    updateField("arrests", data.arrestos || '0');
                    updateField("warnings", data.advertencias || '0');
                    updateField("license-status", data.licencia || 'VIGENTE');
                }
            });

            window.history.replaceState({}, document.title, "/sistema-pnc/");
        })
        .catch(console.error);
    }
};

// Función auxiliar para actualizar textos de forma segura
function updateField(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}
