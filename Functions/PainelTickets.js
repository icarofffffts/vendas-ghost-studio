const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js")
const { tickets } = require("../DataBaseJson")

async function painelTicket(interaction) {
    const embed = new EmbedBuilder()
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()


    if (tickets.get(`tickets.aparencia.title`) !== null) {
        embed.setTitle(tickets.get(`tickets.aparencia.title`))
    }
    if (tickets.get(`tickets.aparencia.description`) !== null) {
        embed.setDescription(tickets.get(`tickets.aparencia.description`))
    }
    if (tickets.get(`tickets.aparencia.color`) !== null) {
        embed.setColor(tickets.get(`tickets.aparencia.color`))
    }
    if (tickets.get(`tickets.aparencia.banner`) !== null) {
        embed.setImage(tickets.get(`tickets.aparencia.banner`))
    }

    const funcoes = tickets.get(`tickets.funcoes`);

    if(funcoes !== null){

    let count = 0;
    let maxItems = 4;
    for (const chave in funcoes) {
        if (count >= maxItems) {
            break;
        }

        const objetoAtual = funcoes[chave];

        const nome = objetoAtual.nome;
        const predescricao = objetoAtual.predescricao;
        const descricao = objetoAtual.descricao;
        const emoji = objetoAtual.emoji;

        embed.addFields({ name: `**${nome}**`, value: `**Pré descrição:** \`${predescricao}\`\n**Emoji:** ${emoji == undefined ? `Não definido.` : emoji}\n**Descrição:**\n${descricao == undefined ? `Não definido, será enviado o principal.` : descricao}\n\n` });

        count++;
    }


        if (Object.keys(funcoes).length > maxItems) {
            const maisItens = `Mais ${Object.keys(funcoes).length - maxItems} item${Object.keys(funcoes).length - maxItems > 1 ? 's' : ''}...`;
            embed.addFields({ name: '\u200B', value: maisItens });
        }
    

}

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("definiraparencia")
                .setLabel('Definir aparência')
                .setEmoji(`<:etiqueta_ghost:1327003124350587012>`)
                .setStyle(1),


        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addfuncaoticket")
                .setLabel('Adicionar função')
                .setEmoji(`<:maisvendas:1245085191555252265>`)
                .setStyle(3),

            new ButtonBuilder()
                .setCustomId("remfuncaoticket")
                .setLabel('Remover função')
                .setEmoji(`<:erradored:1245086529856999495> `)
                .setStyle(4),

        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("postarticket")
                .setLabel('Postar')
                .setEmoji(`<:corrretoverde:1245086497263321118> `)
                .setStyle(1),

            new ButtonBuilder()
                .setCustomId("sincronizarticket")
                .setLabel('Sincronizar')
                .setEmoji(`<:copyandpaste:1319725166548357181>`)
                .setStyle(2),

            new ButtonBuilder()
                .setCustomId("voltar00")
                .setLabel('Voltar')
                .setEmoji(`<:emoji_44:1319752370183471256>`)
                .setStyle(2)
        )

    await interaction.update({ content: ``, embeds: [embed], components: [row2, row3, row4] })
}


module.exports = {
    painelTicket
}