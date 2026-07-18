const { GatewayIntentBits, Client, Collection, ChannelType, EmbedBuilder, Partials, Events } = require("discord.js")
const { AtivarIntents } = require("./Functions/StartIntents");
const express = require("express");
const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        Object.keys(GatewayIntentBits),
    ],
    partials: [ Object.keys(Partials) ]
});

const estatisticasStormInstance = require("./Functions/VariaveisEstatisticas");
const EstatisticasStorm = new estatisticasStormInstance();
module.exports = { EstatisticasStorm }

AtivarIntents()

const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error("[ERRO] DISCORD_TOKEN nao definido no ambiente.");
    process.exit(1);
}
const events = require('./Handler/events')
const slash = require('./Handler/slash')

slash.run(client)
events.run(client)

client.slashCommands = new Collection();

app.set('trust proxy', 1);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.removeHeader('X-Powered-By');
    next();
});

const loginRouter = require("./routes/login");
const callbackRouter = require("./routes/callback");

app.use("/auth", loginRouter);
app.use("/auth", callbackRouter);

app.get("/health", (req, res) => res.json({ status: "ok", timestamp: Date.now() }));

app.use((req, res) => res.status(404).json({ message: "Rota não encontrada", status: 404 }));

app.use((err, req, res, next) => {
    console.error("[Express] Erro não tratado:", err.message);
    res.status(500).json({ message: "Erro interno do servidor", status: 500 });
});

client.login(token);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`[Express] Servidor rodando na porta ${PORT}`));