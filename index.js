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
const slash = require('./Handler/slash');

slash.run(client)
events.run(client)

client.slashCommands = new Collection();

client.login(token);
