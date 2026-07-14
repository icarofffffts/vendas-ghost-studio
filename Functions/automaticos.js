const { ApplicationCommandType, EmbedBuilder, Webhook, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("discord.js")
const { JsonDatabase } = require("wio.db");
const { produtos, configuracao } = require("../DataBaseJson");

async function automatico(interaction, client) {


        const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("configrepostagem")
            .setLabel('Repostagem Automatica')
            .setEmoji('<:configbot:1319725163415208017>')
            .setDisabled(true)
            .setStyle(1),

            new ButtonBuilder()
            .setCustomId("configmsgauto")
            .setLabel('Mensagem Automatica')
            .setEmoji('<:configbot:1319725163415208017>')
            .setStyle(1),

            new ButtonBuilder()
            .setCustomId("configlock")
            .setLabel('Lock Automatico')
            .setEmoji('1236318228477775993')
            .setStyle(1),

        )

        const row3 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("voltar1")
                .setEmoji(`<:emoji_44:1319752370183471256>`)
                .setLabel('Voltar')
                .setStyle(2)

        )

    await interaction.update({ embeds: [], content: `Oque deseja configurar?`, ephemeral: true, components: [row2, row3]/* row4, row3]*/ })
}


module.exports = {
    automatico
}
