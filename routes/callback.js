const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();
const { token } = require("../config.json");
const { url, clientid, secret, role, guild_id, webhook_logs } = require("../DataBaseJson/configauth.json");
const requestIp = require("request-ip");
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: "./DataBaseJson/users.json" });
const tokenBot = token;
const axios = require("axios");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");

function gettempodessaporra(creationDate) {
    const now = new Date();
    const created = new Date(creationDate);
    const diff = new Date(now - created);
    const years = diff.getUTCFullYear() - 1970;
    const months = diff.getUTCMonth();
    const days = diff.getUTCDate() - 1;

    let essafitaprc = '';
    if (months > 0) essafitaprc += `${months} meses `;

    return essafitaprc.trim();
}

function getCreationDate(discordId) {
    const binary = BigInt(discordId).toString(2).padStart(64, '0').slice(0, 42);
    const timestamp = parseInt(binary, 2) + 1420070400000;
    return new Date(timestamp);
}

function parseUserAgent(userAgent) {
    const osRegex = /\(([^)]+)\)/;
    const browserRegex = /([a-zA-Z]+)\/([0-9.]+)/g;

    const osMatch = userAgent.match(osRegex);
    const os = osMatch ? osMatch[1] : "Unknown OS";

    let browser = "Unknown Browser";
    let match;
    while ((match = browserRegex.exec(userAgent)) !== null) {
        if (match[1] !== "Mozilla" && match[1] !== "AppleWebKit" && match[1] !== "Safari") {
            browser = `${match[1]} ${match[2]}`;
            break;
        }
    }

    return `${os}, ${browser}`;
}

router.get("/auth/callback", async (req, res) => {
    const ip = requestIp.getClientIp(req);
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Tá faltando o bagulhete ai fiote", status: 400 });

    res.redirect("https://blankverify.squareweb.app/");
    
    const responseToken = await axios.post(
        'https://discord.com/api/oauth2/token',
        `client_id=${clientid}&client_secret=${secret}&code=${code}&grant_type=authorization_code&redirect_uri=${url}/auth/callback&scope=identify`,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    const token = responseToken.data;
    const responseUser = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${token.token_type} ${token.access_token}`,
        },
    });

    const user = responseUser.data;
    const datadecri = getCreationDate(user.id);
    const tempodessaporra = gettempodessaporra(datadecri);
    let loc = 'N/A';
        const ipInfoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
        const ipInfo = ipInfoResponse.data;
        loc = `${ipInfo.city || 'Unknown City'}, ${ipInfo.region || 'Unknown Region'}, ${ipInfo.country || 'Unknown Country'}`;

    const userAgent = req.get('User-Agent');
    const dispositivo = parseUserAgent(userAgent);

    const guildUrl = `https://discord.com/api/v9/guilds/${guild_id}/members/${user.id}`;
    const headers = {
        'Authorization': `Bot ${tokenBot}`,
        'Content-Type': 'application/json',
    };
    await axios.patch(guildUrl, { roles: [role] }, { headers });
        await axios.post(webhook_logs, {
            content: `<@${user.id}>`,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`✅ | Usuário Verificado.`)
                    .addFields(
                        {
                            name: "👥 Usuário:",
                            value: `<@${user.id}>`,
                            inline: true
                        },
                        {
                            name: "🪐 IP do Usuário",
                            value: `||${ip}||`,
                            inline: true
                        },
                        {
                            name: "🔎 Conta Criada:",
                            value: `\`há ${accountAge}\``,
                            inline: true
                        },
                        {
                            name: "🔐 **Informações Adicionais**",
                            value: `- 🇧🇷 **Localização:** ${loc}\n- 🖥 Dispositivo: ${dispositivo}`
                        }
                    )
                    .setColor(2826033)
            ],
        });

    await users.set(`${user.id}`, {
        username: user.username,
        acessToken: token.access_token,
        refreshToken: token.refresh_token,
        code,
    });
});

module.exports = router;
