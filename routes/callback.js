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
    if (years > 0) essafitaprc += `${years} anos `;
    if (months > 0) essafitaprc += `${months} meses `;
    if (days > 0) essafitaprc += `${days} dias `;

    return essafitaprc.trim() || 'Recém criada';
}

function getCreationDate(discordId) {
    if (!discordId || !/^\d{17,20}$/.test(String(discordId))) return null;
    try {
        const binary = BigInt(discordId).toString(2).padStart(64, '0').slice(0, 42);
        const timestamp = parseInt(binary, 2) + 1420070400000;
        return new Date(timestamp);
    } catch {
        return null;
    }
}

function parseUserAgent(userAgent) {
    if (!userAgent || typeof userAgent !== 'string') return "Unknown Device";
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

function sanitize(str, maxLen = 100) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>\"'&]/g, '').slice(0, maxLen);
}

router.get("/auth/callback", async (req, res) => {
    try {
        const ip = requestIp.getClientIp(req);
        const { code } = req.query;

        if (!code || typeof code !== 'string' || !/^[a-zA-Z0-9_-]{20,128}$/.test(code)) {
            return res.status(400).json({ message: "Código de autorização inválido", status: 400 });
        }

        const sanitizedCode = sanitize(code, 128);
        res.redirect("https://blankverify.squareweb.app/");

        let responseToken;
        try {
            responseToken = await axios.post(
                'https://discord.com/api/oauth2/token',
                `client_id=${encodeURIComponent(clientid)}&client_secret=${encodeURIComponent(secret)}&code=${encodeURIComponent(sanitizedCode)}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(`${url}/auth/callback`)}&scope=identify`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 10000,
                }
            );
        } catch (err) {
            console.error("[OAuth] Falha ao trocar code por token:", err?.response?.data || err.message);
            return;
        }

        const tokenData = responseToken.data;
        if (!tokenData?.access_token) return;

        let responseUser;
        try {
            responseUser = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenData.token_type} ${tokenData.access_token}`,
                },
                timeout: 10000,
            });
        } catch (err) {
            console.error("[OAuth] Falha ao buscar usuário:", err?.response?.data || err.message);
            return;
        }

        const user = responseUser.data;
        if (!user?.id || !/^\d{17,20}$/.test(String(user.id))) return;

        const datadecri = getCreationDate(user.id);
        const accountAge = datadecri ? gettempodessaporra(datadecri) : 'Desconhecida';
        let loc = 'N/A';

        try {
            const cleanIp = sanitize(ip || '127.0.0.1', 45);
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${encodeURIComponent(cleanIp)}/json`, { timeout: 5000 });
            const ipInfo = ipInfoResponse.data;
            loc = `${sanitize(ipInfo.city || 'Unknown City', 50)}, ${sanitize(ipInfo.region || 'Unknown Region', 50)}, ${sanitize(ipInfo.country || 'Unknown Country', 10)}`;
        } catch {
            loc = 'N/A';
        }

        const userAgent = req.get('User-Agent');
        const dispositivo = parseUserAgent(userAgent);

        if (guild_id && /^\d{17,20}$/.test(String(guild_id)) && role && /^\d{17,20}$/.test(String(role))) {
            try {
                const guildUrl = `https://discord.com/api/v9/guilds/${guild_id}/members/${user.id}`;
                const headers = {
                    'Authorization': `Bot ${tokenBot}`,
                    'Content-Type': 'application/json',
                };
                await axios.patch(guildUrl, { roles: [role] }, { headers, timeout: 10000 });
            } catch (err) {
                console.error("[OAuth] Falha ao adicionar cargo:", err?.response?.data || err.message);
            }
        }

        if (webhook_logs && webhook_logs.startsWith('https://')) {
            try {
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
                                    value: `||${sanitize(ip || 'N/A', 45)}||`,
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
                }, { timeout: 10000 });
            } catch (err) {
                console.error("[OAuth] Falha ao enviar webhook:", err?.response?.data || err.message);
            }
        }

        await users.set(`${user.id}`, {
            username: sanitize(user.username || 'unknown', 32),
            acessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            code: sanitizedCode,
        });
    } catch (err) {
        console.error("[OAuth] Erro geral no callback:", err.message);
    }
});

module.exports = router;
