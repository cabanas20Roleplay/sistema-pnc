function loginWithDiscord() {
    // Tu URL oficial de conexión
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
            
            // Ocultar login y mostrar dashboard
            document.getElementById("login-section").classList.add("hidden");
            document.getElementById("dashboard").classList.remove("hidden");

            // Cargar datos del usuario
            document.getElementById("user-name").innerText = username.toUpperCase();
            document.getElementById("user-id").innerText = `EXPEDIENTE: #SV-${id.substring(0, 8)}`;
            
            if(avatar) {
                document.getElementById("user-avatar").src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`;
            } else {
                document.getElementById("user-avatar").src = "https://cdn.discordapp.com/embed/avatars/1.png";
            }

            // Limpiar URL por seguridad
            window.history.replaceState({}, document.title, "/sistema-pnc/");
        })
        .catch(err => {
            console.error(err);
            alert("Error al sincronizar con el servidor de la PNC.");
        });
    }
};

