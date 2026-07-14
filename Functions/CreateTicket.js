const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { configuracao, tickets } = require("../DataBaseJson");

async function CreateTicket(interaction, valor) {
    await interaction.reply({ content: `🔄 | Aguarde estamos criando seu Ticket!`, ephemeral: true });

    const ticketFunction = tickets.get(`tickets.funcoes.${valor}`);
    const appearance = tickets.get(`tickets.aparencia`);

    if (!ticketFunction || Object.keys(ticketFunction).length === 0) {
        return interaction.editReply({ content: `❌ | Essa função não existe!`, ephemeral: true });
    }

    const existingThread = interaction.channel.threads.cache.find(thread => thread.name.includes(interaction.user.id));
    if (existingThread) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${existingThread.id}`)
                .setLabel('Ir para o Ticket')
                .setStyle(5)
        );

        return interaction.editReply({ content: `❌ Você já possui um ticket aberto.`, components: [row], ephemeral: true });
    }

    const thread = await interaction.channel.threads.create({
        name: `${valor}・${interaction.user.username}・${interaction.user.id}`,
        type: ChannelType.PrivateThread,
        reason: 'Ticket aberto',
        permissionOverwrites: [
            {
                id: configuracao.get('ConfigRoles.cargoadm'),
                allow: [PermissionFlagsBits.SendMessagesInThreads],
            },
            {
                id: configuracao.get('ConfigRoles.cargosup'),
                allow: [PermissionFlagsBits.SendMessagesInThreads],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.SendMessagesInThreads],
            },
        ],
    });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
            .setLabel('Ir para o Ticket')
            .setStyle(5)
    );

    await interaction.editReply({ content: `✅ Ticket criado com sucesso!`, components: [row], ephemeral: true });

    const embed = new EmbedBuilder()
        .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(valor)
        .setDescription(ticketFunction.descricao || ticketFunction.predescricao)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    if (ticketFunction.banner) {
        embed.setImage(ticketFunction.banner);
    }

    if (appearance.color) {
        embed.setColor(appearance.color);
    }

    const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('lembrar123')
            .setLabel('Lembrar')
            .setEmoji('1250592230368870420')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('assumir')
            .setLabel('Assumir')
            .setEmoji('1246684179505348642')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('deletar')
            .setLabel('Deletar')
            .setEmoji('<:erradored:1245086529856999495> ')
            .setStyle(4)
    );

    await thread.send({
        components: [actionRow],
        embeds: [embed],
        content: `${interaction.user} ${configuracao.get('ConfigRoles.cargoadm') ? `<@&${configuracao.get('ConfigRoles.cargoadm')}>` : ''} ${configuracao.get('ConfigRoles.cargosup') ? `<@&${configuracao.get('ConfigRoles.cargosup')}>` : ''}`
    });
}

module.exports = {
    CreateTicket
};
