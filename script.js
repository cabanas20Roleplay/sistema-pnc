function loginWithDiscord() {
    // URL Corregida (con comilla de cierre y response_type=token)
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1473860253652226292&response_type=token&redirect_uri=https%3A%2F%2Fcabanas20roleplay.github.io%2Fsistema-pnc%2F&scope=identify+guilds+email";
}

window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));

    if (fragment.has("access_token")) {
        const accessToken = fragment.get("access_token");
        const tokenType = fragment.get("token_type");

        // Pedimos los datos del usuario a la API de Discord
        fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
        })
        .then(res => res.json())
        .then(response => {
            const { username, id, avatar } = response;
            
            // 1. Ocultamos la sección de login y mostramos el dashboard
            const loginSection = document.getElementById("login-section");
            const dashboard = document.getElementById("dashboard");

            if (loginSection) loginSection.classList.add("hidden");
            if (dashboard) dashboard.classList.remove("hidden");

            // 2. Mostramos los datos del ciudadano en los elementos HTML
            if (document.getElementById("user-name")) {
                document.getElementById("user-name").innerText = username;
            }
            
            if (document.getElementById("user-id")) {
                document.getElementById("user-id").innerText = `EXPEDIENTE: #SV-${id.substring(0, 8)}`;
            }
            
            if (document.getElementById("user-avatar")) {
                if (avatar) {
                    document.getElementById("user-avatar").src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
                } else {
                    document.getElementById("user-avatar").src = "https://cdn.discordapp.com/embed/avatars/0.png";
                }
            }

            // 3. Limpiamos la URL para que no se vea el token por seguridad
            window.history.replaceState({}, document.title, "/sistema-pnc/");
            
            console.log("Sesión iniciada con éxito para:", username);
        })
        .catch(err => {
            console.error("Error al conectar con Discord:", err);
            alert("Hubo un error al obtener tus datos de Discord.");
        });
    }
};
