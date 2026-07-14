const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { produtos, configuracao } = require("../DataBaseJson");
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));

function getSaudacao() {
  const brazilTime = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"});
  const hora = new Date(brazilTime).getHours();

  if (hora < 12) {
      return 'Bom dia';
  } else if (hora < 18) {
      return 'Boa tarde';
  } else {
      return 'Boa noite';
  }
}

async function Painel(interaction, client) {

  const embed = new EmbedBuilder()
  .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
  .setTitle(`Painel`)
  .setAuthor({ name: ` Ghost Studio Bot`, iconURL: "https://images-ext-1.discordapp.net/external/HlSwC7-CPbegBHLw_hi7ejQE6uB9Zm3lBmSA7_UO-Vk/%3Fsize%3D2048/https/cdn.discordapp.com/emojis/1246683553434042450.png?format=webp&quality=lossless" })
  .setDescription(`${getSaudacao()} senhor(a) ${interaction.user}, o que deseja fazer?`)
  .addFields(
    { name: `**Versão do eOS**`, value: `4.1.6`, inline: true },
    { name: `**Ping**`, value: `\`${await client.ws.ping} MS\``, inline: true },
    { name: `**Uptime**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true },

  )
  .setFooter(
    { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
  )
  .setTimestamp()


  const ticketButton = process.env.TICKET_ENABLED === 'true' ? new ButtonBuilder()
    .setCustomId("painelconfigticket")
    .setLabel('Ticket')
    .setEmoji(`<:etiqueta_ghost:1327003124350587012>`)
    .setStyle(1)
    .setDisabled(false) : null;

  const buttons = [
    new ButtonBuilder()
      .setCustomId("painelconfigvendas")
      .setLabel('Loja')
      .setEmoji(`<:site:1336204752035512370>`)
      .setStyle(1)
      .setDisabled(false),

    new ButtonBuilder()
      .setCustomId("painelconfigbv")
      .setLabel('Boas Vindas')
      .setEmoji(`:CaixaWQ:1267889222598266984>`)
      .setStyle(1)
      .setDisabled(false),

    new ButtonBuilder()
      .setCustomId("eaffaawwawa")
      .setLabel('Ações Automaticas')
      .setEmoji(`<:configbot:1319725163415208017> `)
      .setStyle(2)
      .setDisabled(false),
  ];

  if (ticketButton) {
    buttons.splice(1, 0, ticketButton);
  }

  const row2 = new ActionRowBuilder()
    .addComponents(...buttons)

  const row3 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("painelpersonalizar")
        .setLabel('Personalizar bot')
        .setEmoji(`<:etiqueta_ghost:1327003124350587012>`)
        .setStyle(1)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("rendimento")
        .setLabel('Rendimento')
        .setEmoji(`<:buy:1319766396300693614>`)
        .setStyle(3)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("gerenciarconfigs")
        .setLabel('Definições')
        .setEmoji(`<:configbot:1319725163415208017> `)
        .setStyle(2)
        .setDisabled(false),
    )

    const row4 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("load")
        .setLabel('Loading')
        .setEmoji(`<:reload_Ghost:1336227317118144534> `)
        .setStyle(1)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("invitetraker")
        .setLabel('Invite Logger')
        .setEmoji(`<:001_link:1319753527261659256`)
        .setStyle(1)
        .setDisabled(false),


      new ButtonBuilder()
        .setCustomId("protecaoserver")
        .setLabel('Proteção')
        .setEmoji(`<:reddiscord_crz:1319724951162585128>`)
        .setStyle(3)
        .setDisabled(false),

      
      new ButtonBuilder()
        .setCustomId("confignitrofree")
        .setLabel('Nitro Free')
        .setEmoji(`<:nitroeboost:1336421034236051599>`)
        .setStyle(2)
        .setDisabled(false),
    )

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row2, row3, row4], embeds: [embed], ephemeral: true })
  } else {
    interaction.update({ content: ``, components: [row2, row3, row4], embeds: [embed], ephemeral: true })
  }
}


async function Gerenciar2(interaction, client) {

  const ggg = produtos.valueArray();


  const embed = new EmbedBuilder()
    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
    .setTitle(`Painel de Administração`)
    .setDescription(`${getSaudacao()} Senhor(a) **${interaction.user.username}**, escolha o que deseja fazer, Iremos Levar em consideração que o Botão Gerenciar Campos Localizado em /Gerenciar/Produto/ Seje Configurado!`)
    .addFields(
      { name: `**Total de produtos fornecidos**`, value: `${ggg.length}`, inline: true },
    )
    .setFooter(
      { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
    )
    .setTimestamp()

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("criarrrr")
        .setLabel('Criar')
        .setEmoji(`<:site:1336204752035512370>`)
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarotemae")
        .setLabel('Gerenciar')
        .setEmoji(`<:site:1336204752035512370>`)
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarposicao")
        .setLabel('Top Gastadores')
        .setEmoji(`<:emoji_44:1319752370183471256>`)
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



  await interaction.update({ embeds: [embed], components: [row2,row3], content: `` })



}



module.exports = {
  Painel,
  Gerenciar2
}
