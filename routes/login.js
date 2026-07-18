const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();
const {url, clientid, secret} = require("../DataBaseJson/configauth.json");

router.get("/auth/login", async(req, res) => {
    if (!url || !clientid || !secret) {
        return res.status(500).json({ message: "Configuração do servidor incompleta", status: 500 });
    }

    try {
        const redirectUri = `${url}/auth/callback`;
        if (!/^https?:\/\/.+/.test(redirectUri)) {
            return res.status(500).json({ message: "URL de redirect inválida", status: 500 });
        }

        const authUrl = oauth.generateAuthUrl({
            clientId: clientid,
            clientSecret: secret,
            scope: ["identify", "guilds.join"],
            redirectUri: redirectUri
        });

        res.redirect(authUrl);
    } catch(err) {
        console.error("[Auth] Erro ao gerar URL de login:", err.message);
        res.status(500).json({
            message: "Erro interno ao processar login",
            status: 500
        });
    }
});

module.exports = router;