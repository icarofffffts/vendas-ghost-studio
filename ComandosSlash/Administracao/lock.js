const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Discord = require("discord.js");
const { getPermissions } = require("../../Functions/PermissionsCache.js");

module.exports = {
  name: "lock",
  description: "Trancar Chat",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
  run: async (client, interaction) => {

    const perm = await getPermissions(client.user.id);
    if (!perm || !perm.includes(interaction.user.id)) {
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    const unlockButton = new ButtonBuilder()
      .setCustomId('Desbloquear1')
      .setLabel('Desbloquear')
      .setStyle(ButtonStyle.Secondary);

    const buttonRow = new ActionRowBuilder().addComponents(unlockButton);

    let lockEmbed = new EmbedBuilder()
      .setDescription(`🔒 Este canal foi bloqueado por ${interaction.user}.`)
      .setColor('#2b2d31');

    interaction.reply({ embeds: [lockEmbed], components: [buttonRow] }).then(msg => {

      interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false })
        .catch(error => {
          console.error(error);
          interaction.reply({ content: 'Erro ao trancar o canal. Verifique as permissões do bot.' });
        });
    });

    const collector = interaction.channel.createMessageComponentCollector();

    collector.on("collect", async (collectedInteraction) => {
      if (collectedInteraction.user.id !== interaction.user.id) {
        collectedInteraction.reply({ content: "**:x: Você não Tem permissão para destrancar esse canal**", ephemeral: true });
      } else {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });

        const unlockEmbed = new EmbedBuilder()
          .setDescription(`🔓 Esse canal foi desbloqueado por ${interaction.user}.`)
          .setColor('#2b2d31');

        collectedInteraction.update({ embeds: [unlockEmbed], components: [] })
      }
    });
  }
};