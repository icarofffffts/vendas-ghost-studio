const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");

async function Gerenciar(interaction, client) {


    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configcargos")
                .setLabel('Cargos')
                .setEmoji(`<:engrenagem:1319726888649887796>`)
                .setStyle(2),

            new ButtonBuilder()
                .setCustomId("personalizarcanais")
                .setLabel('Canais')
                .setEmoji(`<:engrenagem:1319726888649887796>`)
                .setStyle(2),

        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("personalizarantifake")
                .setLabel('Anti-Fake')
                .setEmoji(`<:emoji_44:1319752370183471256>`)
                .setStyle(2),

            new ButtonBuilder()
                .setCustomId("formasdepagamentos")
                .setLabel('Formas de pagamento')
                .setEmoji(`<:buy:1319766396300693614>`)
                .setStyle(1),

        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar00")
                .setLabel('Voltar')
                .setEmoji(`<:emoji_44:1319752370183471256>`)
                .setStyle(2)

        )


    if (interaction.message == undefined) {
        interaction.reply({ embeds: [], components: [row1, row2, row3], content: `O que precisa configurar?` })
    } else {
        interaction.update({ embeds: [], components: [row1, row2, row3], content: `O que precisa configurar?` })
    }

}



module.exports = {
    Gerenciar
}
