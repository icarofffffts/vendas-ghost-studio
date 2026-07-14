const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { configuracao } = require("../DataBaseJson");

function msgbemvindo(interaction, client) {
    const embed = new EmbedBuilder()
        .setColor(`${configuracao.get(`Cores.Principal`) == null ? "0cd4cc" : configuracao.get("Cores.Principal")}`)
        .setTitle("Configurar Boas vindas")
        .setDescription(
            `
**Mensagem**
${configuracao.get("Entradas.msg") == null ? "Não definido" : configuracao.get("Entradas.msg")}${
                configuracao.get(`Entradas.tempo`) == null || configuracao.get(`Entradas.tempo`) === 0
                    ? ""
                    : `\n**Tempo**\n\`${configuracao.get(`Entradas.tempo`)} segundos\``
            }`
        )
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("editarmensagemboasvindas").setLabel("Editar").setEmoji(`<:Lapisv2:1253917126167760946>`).setStyle(1),

        new ButtonBuilder().setCustomId("voltar00").setLabel("Voltar").setEmoji(`<:emoji_44:1319752370183471256>`).setStyle(2)
    );

    interaction.update({ components: [row2], embeds: [embed] });
}

module.exports = {
    msgbemvindo,
};
