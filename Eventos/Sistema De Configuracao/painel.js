
const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { Painel, Gerenciar2 } = require("../../Functions/Painel");
const { Gerenciar } = require("../../Functions/Gerenciar");
const { automatico } = require("../../Functions/automaticos");
const { ConfigRoles } = require("../../Functions/ConfigRoles");
const { msgbemvindo } = require("../../Functions/MensagemBemVindo");
const { EstatisticasStorm } = require("../../index.js");
const { profileuser } = require("../../Functions/profile");
const { produtos, configuracao, tickets } = require("../../DataBaseJson");
const { Posicao1 } = require("../../Functions/PosicoesFunction.js");
const { painelTicket } = require("../../Functions/PainelTickets.js");
const { CreateMessageTicket, Checkarmensagensticket } = require("../../Functions/CreateMensagemTicket.js");
const { CreateTicket } = require("../../Functions/CreateTicket.js");
const { GerenciarCampos2 } = require("../../Functions/GerenciarCampos.js");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const EventEmitter = require("events");

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == Discord.InteractionType.ModalSubmit) {

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'sdaju11111231idsj1233js123dua123') {
                let NOME = interaction.fields.getTextInputValue('tokenMP');
                let PREDESC = interaction.fields.getTextInputValue('tokenMP2');
                let DESC = interaction.fields.getTextInputValue('tokenMP3');
                let BANNER = interaction.fields.getTextInputValue('tokenMP5');
                let EMOJI = interaction.fields.getTextInputValue('tokenMP6');

                NOME = NOME.replace('.', '');
                PREDESC = PREDESC.replace('.', '');

                if (tickets.get(`tickets.funcoes.${NOME}`) !== null) {
                    return interaction.reply({ content: `❌ | Já existe uma função com esse nome!`, ephemeral: true });
                }

                if (NOME.length > 32) {
                    return interaction.reply({ content: `❌ | O nome não pode ter mais de 32 caracteres!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.nome`, NOME)
                }

                if (PREDESC.length > 64) {
                    return interaction.reply({ content: `❌ | A pré descrição não pode ter mais de 64 caracteres!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.predescricao`, PREDESC)
                }

                if (DESC !== '') {
                    if (DESC.length > 1024) {
                        return interaction.reply({ content: `❌ | A descrição não pode ter mais de 1024 caracteres!`, ephemeral: true });
                    } else {
                        tickets.set(`tickets.funcoes.${NOME}.descricao`, DESC)
                    }
                }

                if (BANNER !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(BANNER)) {
                        tickets.set(`tickets.funcoes.${NOME}.banner`, BANNER)
                        return interaction.reply({ message: dd, content: `❌ | Você escolheu incorretamente a URL do banner!`, ephemeral: true });
                    } else {
                        tickets.set(`tickets.funcoes.${NOME}.banner`, BANNER)
                    }
                }

                if (EMOJI !== '') {
                    const emojiRegex = /^<:.+:\d+>$|^<a:.+:\d+>$|^\p{Emoji}$/u;
                    if (!emojiRegex.test(EMOJI)) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o emoji!`, ephemeral: true });
                    } else {
                        tickets.set(`tickets.funcoes.${NOME}.emoji`, EMOJI)
                    }
                }

                await painelTicket(interaction)

                interaction.followUp({ content: `✅ | Função adicionada com sucesso!`, ephemeral: true });




            }

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == '0-89du0awd8awdaw8daw') {

                let TITULO = interaction.fields.getTextInputValue('tokenMP');
                let DESC = interaction.fields.getTextInputValue('tokenMP2');
                let BANNER = interaction.fields.getTextInputValue('tokenMP3');
                let COREMBED = interaction.fields.getTextInputValue('tokenMP5');

                if (TITULO.length > 256) {
                    return interaction.reply({ content: `❌ | O título não pode ter mais de 256 caracteres!`, ephemeral: true });
                }
                if (DESC.length > 1024) {
                    return interaction.reply({ content: `❌ | A descrição não pode ter mais de 1024 caracteres!`, ephemeral: true });
                }

                if (COREMBED !== '') {
                    const hexColorRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                    if (!hexColorRegex.test(COREMBED)) {
                        
                        return interaction.reply({ content: `❌ Código Hex Color \`${COREMBED}\` inváldo, tente pegar [nesse site.](https://www.google.com/search?q=color+picker&oq=color+picker) `, ephemeral: true });
                    }else{
                        tickets.set(`tickets.aparencia.color`, COREMBED)
                    }
                }



                if (BANNER !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(BANNER)) {
                     
                        return interaction.reply({ message: dd, content: `❌ | Você escolheu incorretamente a URL do banner!`, ephemeral: true });
                    }else{
                        tickets.set(`tickets.aparencia.banner`, BANNER)
                    }
                }

                if (TITULO !== '') {
                    tickets.set(`tickets.aparencia.title`, TITULO)
                } else {
                    tickets.delete(`tickets.aparencia.title`)
                }

                if (DESC !== '') {
                    tickets.set(`tickets.aparencia.description`, DESC)
                } else {
                    tickets.delete(`tickets.aparencia.description`)
                }

                await painelTicket(interaction)


            }

      


            if (interaction.customId === 'aslfdjauydvaw769dg7waajnwndjo') {

                let VALOR = interaction.fields.getTextInputValue('tokenMP');
                let CARGO = interaction.fields.getTextInputValue('tokenMP2');


                if (CARGO !== '' && VALOR !== '') {
                    const role = await interaction.guild.roles.fetch(CARGO);

                    if (role === null) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o ID do cargo!`, ephemeral: true });
                    }

                    if (isNaN(VALOR)) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o valor!`, ephemeral: true });
                    }

                    configuracao.set(`posicoes.pos1.role`, CARGO);
                    configuracao.set(`posicoes.pos1.valor`, VALOR);
                } else {
                    configuracao.delete(`posicoes.pos1`);
                }

                await Posicao1(interaction, client)

            }

            if (interaction.customId === "faq") {
                const messageContent = `<:flay_point:1264131946905337918> Sua verificação é essencial para reforçar a segurança do servidor e manter nossa comunidade protegida.\n<:flay_point:1264131946905337918> Além disso, em casos raros de queda do servidor, a verificação nos permite trazê-lo de volta rapidamente para que você não perca nenhum momento importante.\n<:flay_point:1264131946905337918> Isso também ajuda a evitar contas falsas.`;
          
                interaction.reply({
                  content: messageContent,
                  components: [
                    {
                      type: 1,
                      components: [
                        {
                          type: 2, 
                          style: 5,
                          label: "Verificar-se",
                          url: `https://discord.com/oauth2/authorize?client_id=1241397849195810846&redirect_uri=https://restorecord.com/api/callback&response_type=code&scope=identify+guilds.join+email&state=1250189025189298226`
                        }
                      ]
                    }
                  ],
                  ephemeral: true
                });
              }

            if (interaction.customId === 'awiohdbawudwdwhduawdnuaw') {

                let VALOR = interaction.fields.getTextInputValue('tokenMP');
                let CARGO = interaction.fields.getTextInputValue('tokenMP2');


                if (CARGO !== '' && VALOR !== '') {
                    const role = await interaction.guild.roles.fetch(CARGO);

                    if (role === null) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o ID do cargo!`, ephemeral: true });
                    }

                    if (isNaN(VALOR)) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o valor!`, ephemeral: true });
                    }

                    configuracao.set(`posicoes.pos2.role`, CARGO);
                    configuracao.set(`posicoes.pos2.valor`, VALOR);
                } else {
                    configuracao.delete(`posicoes.pos2`);
                }

                await Posicao1(interaction, client)
            }

            if (interaction.customId === 'uy82819171h172') {

                let VALOR = interaction.fields.getTextInputValue('tokenMP');
                let CARGO = interaction.fields.getTextInputValue('tokenMP2');

                if (CARGO !== '' && VALOR !== '') {
                    const role = await interaction.guild.roles.fetch(CARGO);

                    if (role === null) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o ID do cargo!`, ephemeral: true });
                    }

                    if (isNaN(VALOR)) {
                        return interaction.reply({ content: `❌ | Você escolheu incorretamente o valor!`, ephemeral: true });
                    }

                    configuracao.set(`posicoes.pos3.role`, CARGO);
                    configuracao.set(`posicoes.pos3.valor`, VALOR);
                } else {
                    configuracao.delete(`posicoes.pos3`);
                }

                await Posicao1(interaction, client)
            }

        }

        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'manage_item') {
                const nomeDigitado = interaction.options.getFocused().toLowerCase();
                const produtosFiltrados = produtos.filter(produto => produto.ID.toLowerCase().includes(nomeDigitado));
                const produtosSelecionados = produtosFiltrados.slice(0, 25);
        
                const config = produtosSelecionados.flatMap(produto => {
                    if (produto.data && produto.data.Campos) {
                        const matchingFields = produto.data.Campos.filter(campo =>
                            campo.Nome.toLowerCase().includes(nomeDigitado)
                        );
        
                        return matchingFields.map(campo => ({
                            name: `🧵 ${campo.Nome}`,
                            value: `${produto.ID}_${campo.Nome}`,
                        }));
                    } else {
                        return [];
                    }
                });
        
                const response = config.length > 25 ? config.slice(0, 25) : config;
        
                interaction.respond(response);
            }        

            if (interaction.commandName === 'manage_stock') {
                const nomeDigitado = interaction.options.getFocused().toLowerCase();
                const produtosFiltrados = produtos.filter(produto => produto.ID.toLowerCase().includes(nomeDigitado));
                const produtosSelecionados = produtosFiltrados.slice(0, 25);
            
                const response = produtosSelecionados.map(produto => {
                const name = produto.data.Config ? produto.data.Config.name : "Nome Não Disponível";
            
                    const option = {
                        name: `🧵 ${name}`,
                        value: produto.ID
                    };
            
                    if (JSON.stringify(option).length > 100) {
                        option.name = option.name.substring(0, 90) + '...';
                        option.value = option.value.substring(0, 90) + '...';
                    }
            
                    return option;
                });
                
                interaction.respond(response.length > 0 ? response : [{ name: 'Nenhum produto registrado foi encontrado', value: 'nada' }]);
            }
            


            if (interaction.commandName == 'manage_product') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = produtos.filter(x => x.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    const name = x.data.Config ? x.data.Config.name : "Nome Não Disponível";
                    return {
                        name: `🧵 ${name}`,
                        value: `${x.ID}`
                    };
                });
                
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);

            }
        }

      if (process.env.TICKET_ENABLED === 'true') {
        let valorticket
        if (interaction.isButton() && interaction.customId.startsWith('AbrirTicket_')) {
            valorticket = interaction.customId.replace('AbrirTicket_', '');
            CreateTicket(interaction, valorticket)
        } else if (interaction.isSelectMenu() && interaction.customId === 'abrirticket') {
            valorticket = interaction.values[0]
            CreateTicket(interaction, valorticket)
        }
      }

        if (interaction.isSelectMenu()) {

            if(interaction.customId == 'asdihadbhawhdwhdaw'){


                const campo = interaction.values[0].split('_')[0]
                const produto = interaction.values[0].split('_')[1]


                GerenciarCampos2(interaction, campo, produto, true)

            }

            if(interaction.customId == 'stockhasdhvsudasd'){

                const campo = interaction.values[0].split('_')[0]
                const produto = interaction.values[0].split('_')[1]

                MessageStock(interaction, 1, produto, campo, true)


            }

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'deletarticketsfunction') {
                const valordelete = interaction.values
                for (const iterator of valordelete) {
                    tickets.delete(`tickets.funcoes.${iterator}`)
                }
                painelTicket(interaction)
            }
        }


        if (interaction.isChannelSelectMenu()) {

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'canalpostarticket') {
                await interaction.reply({ content: `🔄 | Aguarde estamos criando sua mensagem!`, ephemeral: true });
                await CreateMessageTicket(interaction, interaction.values[0], client)
                interaction.editReply({ content: `✅ | Mensagem criada com sucesso!`, ephemeral: true });
            }

        }

        if (interaction.isButton()) {

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'sincronizarticket') {
                await interaction.reply({ content: `🔄 | Aguarde estamos atualizando suas mensagem!`, ephemeral: true });
                await Checkarmensagensticket(client)
                interaction.editReply({ content: `✅ | Mensagens atualizada com sucesso!`, ephemeral: true });
            }



            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'arquivar') {

                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) && !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) return interaction.reply({ content: `❌ | Você não tem permissão para fazer isso!`, ephemeral: true });

                try {
                    await interaction.channel.setArchived(true)
                } catch (error) { }
            }

            const { MessageActionRow, MessageButton } = require('discord.js');

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'assumir') {
                let ticketId = interaction.message.id;
                if (tickets[ticketId] && tickets[ticketId].hasStaffInteracted) {
                    return interaction.reply({ content: '❌ | Este ticket já foi atendido.', ephemeral: true });
                }
            
                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) && !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) {
                    return interaction.reply({ content: `❌ | Você não tem permissão para assumir este ticket!`, ephemeral: true });
                }
            
                try {
                    const staffMember = interaction.member;
                    const ultimoIndice = interaction.channel.name.lastIndexOf('・');
                    const ultimosNumeros = interaction.channel.name.slice(ultimoIndice + 1);
            
                    const owner = await interaction.guild.members.fetch(ultimosNumeros);
            
                    const confirmationEmbed = new EmbedBuilder()
                        .setColor('#2b2d31')
                        .setDescription(`👋 | Olá <@!${ultimosNumeros}>, Seu Ticket foi Assumido Pelo Staff ${staffMember}.`);
            
                    const ticketChannel = interaction.guild.channels.cache.get(ticketId);
            
                    const buttonRow = new ActionRowBuilder() .addComponents(
                        new ButtonBuilder()
                                .setLabel('Ir para o Ticket')
                                .setStyle('5')
                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}}`)
                        );
            
                    await owner.send({ embeds: [confirmationEmbed], components: [buttonRow] });
            
                    const confirmationEmbed222 = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setDescription(`👋 | Olá <@!${ultimosNumeros}>, Seu Ticket foi Assumido Pelo Staff ${staffMember}.`);

                    tickets[ticketId] = { hasStaffInteracted: true, hasPokeStaffBeenClicked: false, staffMemberId: staffMember.id };
            

                    await interaction.reply({ embeds: [confirmationEmbed222] });
                } catch (error) {
                }
            }                                

              if (process.env.TICKET_ENABLED === 'true' && interaction.customId === 'deletar') {
                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) &&
                    !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) {
                    return interaction.reply({ content: '❌ | Você não tem permissão para fazer isso!', ephemeral: true });
                }
            
                try {
                    const deletedChannelName = interaction.channel?.name || 'Desconhecido';
            
                    const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });
                    const messagesContent = fetchedMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
            
                    const fs = require('fs');
                    fs.writeFileSync('mensagens_antigas.txt', messagesContent);
            
                    await interaction.channel.delete();
            
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`Canal Deletado: ${deletedChannelName}`)
                        .setDescription(`O canal foi deletado por ${interaction.user} \`(${interaction.user.id})\``)
            
                    const logsChannelId = configuracao.get(`ConfigChannels.logsticket`);
                    const logsChannel = interaction.guild.channels.cache.get(logsChannelId);
                    if (logsChannel) {
                        await logsChannel.send({ embeds: [embed], files: [{ attachment: 'mensagens_antigas.txt', name: 'mensagens_antigas.txt' }] });
                    } else {
                        console.error(`Canal de logs não encontrado com ID ${logsChannelId}`);
                    }
                } catch (error) {
                    console.error('Erro ao deletar o canal:', error);
                }
            }

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId === 'lembrar123') {
                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) && !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) {
                    return interaction.reply({ content: `❌ | Você não tem permissão para fazer isso!`, ephemeral: true });
                }
            
                try {
                    const threadNameParts = interaction.channel.name.split('・');
                    const threadOwnerId = threadNameParts[2];
                    const user = await interaction.client.users.fetch(threadOwnerId);
            
                    const brazilTime = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"});
                    const hour = new Date(brazilTime).getHours();
                    let saudacao;
            
                    if (hour >= 0 && hour < 12) {
                        saudacao = 'Bom dia';
                    } else if (hour >= 12 && hour < 18) {
                        saudacao = 'Boa tarde';
                    } else {
                        saudacao = 'Boa noite';
                    }
            
                    const mensagem = `${saudacao} <@${threadOwnerId}>, você possui um ticket pendente de resposta; se não for respondido, poderá ser fechado.`;
            
                    const row = new ActionRowBuilder() .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)
                            .setLabel('Ir para o Ticket')
                            .setStyle('5')
                    );
        
                    await user.send({
                        content: mensagem,
                        components: [row]
                    });
            
                    await interaction.reply({ content: `✅ | Mensagem enviada ao criador do ticket.`, ephemeral: true });
            
                } catch (error) {
                    await interaction.reply({ content: `❌ | Não foi possível enviar a mensagem, pois o usuário provavelmente bloqueou mensagens privadas.`, ephemeral: true });
                }
            }            

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == `postarticket`) {
                const ggg = tickets.get(`tickets.funcoes`)
                const ggg2 = tickets.get(`tickets.aparencia`)


                if (ggg == null || Object.keys(ggg).length == 0 || ggg2 == null || Object.keys(ggg2).length == 0) {
                    return interaction.reply({ content: `❌ Adicione uma função antes de postar a mensagem.`, ephemeral: true });
                } else {
                    const selectaaa = new Discord.ChannelSelectMenuBuilder()
                        .setCustomId('canalpostarticket')
                        .setPlaceholder('Clique aqui para selecionar')
                        .setChannelTypes(Discord.ChannelType.GuildText)

                    const row1 = new ActionRowBuilder()
                        .addComponents(selectaaa);

                    interaction.reply({ components: [row1], content: `Selecione o canal onde quer postar a mensagem.`, ephemeral: true, })

                }
            }



            if (process.env.TICKET_ENABLED === 'true' && interaction.customId == 'remfuncaoticket') {


                const ggg = tickets.get(`tickets.funcoes`)

             
                    
                if (ggg == null || Object.keys(ggg).length == 0) {
                    return interaction.reply({ content: `❌ Não existe nenhuma função criada para remover.`, ephemeral: true });
                }
                
                 else {

                    const selectMenuBuilder = new Discord.StringSelectMenuBuilder()
                        .setCustomId('deletarticketsfunction')
                        .setPlaceholder('Clique aqui para selecionar')
                        .setMinValues(0)

                    for (const chave in ggg) {
                        const item = ggg[chave];

                        const option = {
                            label: `${item.nome}`,
                            description: `${item.predescricao}`,
                            value: item.nome
                        };

                        selectMenuBuilder.addOptions(option);


                    }

                    selectMenuBuilder.setMaxValues(Object.keys(ggg).length)

                    const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);
                    try {
                        await interaction.update({ components: [style2row], content: `${interaction.user} Qual funções deseja remover?`, embeds: [] })
                    } catch (error) {
                    }
                }

            }


            if (interaction.customId == 'rendimento') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("todayyyy")
                            .setLabel('Hoje')
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("7daysss")
                            .setLabel('Últimos 7 dias')
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("30dayss")
                            .setLabel('Últimos 30 dias')
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("totalrendimento")
                            .setLabel('Rendimento Total')
                            .setStyle(3)
                            .setDisabled(false),
                    )
                interaction.reply({ content: `Olá senhor **${interaction.user.username}**, selecione algum filtro.`, components: [row], ephemeral: true })
            }

            if (interaction.customId == 'gerenciarposicao') {

                Posicao1(interaction, client)

            }



            if (interaction.customId == 'Editarprimeiraposição') {

                const aa = configuracao.get(`posicoes`)

                const modalaAA = new ModalBuilder()
                    .setCustomId('aslfdjauydvaw769dg7waajnwndjo')
                    .setTitle(`Definir primeira posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`VALOR`)
                    .setPlaceholder(`Insira um Valor, Ex: 50`)
                    .setValue(aa?.pos1?.valor == undefined ? '' : aa.pos1?.valor)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`CARGO`)
                    .setPlaceholder(`Insira o id Do Cargo.`)
                    .setValue(aa?.pos1?.role == undefined ? '' : aa.pos1?.role)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);

                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'Editarsegundaposição') {
                const aa = configuracao.get(`posicoes`)

                const modalaAA = new ModalBuilder()
                    .setCustomId('awiohdbawudwdwhduawdnuaw')
                    .setTitle(`Definir segunda posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`VALOR`)
                    .setPlaceholder(`Insira um Valor Ex: 30.`)
                    .setValue(aa?.pos2?.valor == undefined ? '' : aa.pos2?.valor)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`CARGO`)
                    .setPlaceholder(`Insira o Id do Cargo.`)
                    .setValue(aa?.pos2?.role == undefined ? '' : aa.pos2?.role)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);

                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'Editarterceiraposição') {
                const aa = configuracao.get(`posicoes`)
                const modalaAA = new ModalBuilder()
                    .setCustomId('uy82819171h172')
                    .setTitle(`Definir terceira posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`VALOR`)
                    .setPlaceholder(`Insira um Valor, Ex: 10.`)
                    .setValue(aa?.pos3?.valor == undefined ? '' : aa.pos3?.valor)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`CARGO`)
                    .setPlaceholder(`Insira o Id do Cargo.`)
                    .setValue(aa?.pos3?.role == undefined ? '' : aa.pos3?.role)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);

                await interaction.showModal(modalaAA);
            }


            if (interaction.customId == 'todayyyy' || interaction.customId == '7daysss' || interaction.customId == '30dayss' || interaction.customId == 'totalrendimento') {

                let rendimento
                let name

                if (interaction.customId == 'todayyyy') {
                    rendimento = await EstatisticasStorm.SalesToday()
                    name = 'Resumo das vendas de hoje'
                } else if (interaction.customId == '7daysss') {
                    rendimento = await EstatisticasStorm.SalesWeek()
                    name = 'Resumo das vendas nos últimos 7 dias'
                } else if (interaction.customId == '30dayss') {
                    rendimento = await EstatisticasStorm.SalesMonth()
                    name = 'Resumo das vendas nos últimos 30 dias'
                } else if (interaction.customId == 'totalrendimento') {
                    name = 'Resumo geral de todas as vendas'
                    rendimento = await EstatisticasStorm.SalesTotal()
                }


                const embed = new EmbedBuilder()
                    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
                    .setTitle(`${name}`)
                    .addFields(
                        { name: `**Rendimento**`, value: `\`R$ ${Number(rendimento.rendimentoTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\``, inline: true },
                        { name: `**Pedidos aprovados**`, value: `\`${rendimento.quantidadeTotal}\``, inline: true },
                        { name: `**Produtos entregues**`, value: `\`${rendimento.produtosEntregue}\``, inline: true },
                    )
                    .setAuthor({ name: `${interaction.user.username}` })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}` })

                interaction.update({ embeds: [embed] })
            }



            if (interaction.customId.startsWith('criarrrr')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjsdua')
                    .setTitle(`Criação`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`NOME`)
                    .setPlaceholder(`Insira o nome do seu produto`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`DESCRIÇÃO`)
                    .setPlaceholder(`Insira uma descrição para seu produto`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1024)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`ENTREGA AUTOMÁTICA?`)
                    .setPlaceholder(`Digite "sim" ou "não" para ativar ou desativar`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(3)
                    .setRequired(true)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP4')
                    .setLabel(`ICONE (OPCIONAL)`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou gif`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`BANNER (OPCIONAL)`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou gif`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);



                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }


            if (process.env.TICKET_ENABLED === 'true' && interaction.customId.startsWith('addfuncaoticket')) {

                const dd = tickets.get('tickets.funcoes')
               
                
                if (dd && Object.keys(dd).length > 24) {
                    return interaction.reply({ content: `❌ | Você não pode criar mais de 24 funções em seu TICKET!` });
                }
                  
                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111231idsj1233js123dua123')
                    .setTitle(`Adicionar função`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`NOME DA FUNÇÃO`)
                    .setPlaceholder(`Insira aqui um nome, como: Suporte`)
                    .setStyle(TextInputStyle.Short)

                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`PRÉ DESCRIÇÃO`)
                    .setPlaceholder(`Insira aqui uma pré descrição, ex: "Preciso de suporte."`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(99)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`DESCRIÇÃO`)
                    .setPlaceholder(`Insira aqui a descrição da função.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(99)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`BANNER (OPCIONAL)`)
                    .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('tokenMP6')
                    .setLabel(`EMOJI DA FUNÇÃO`)
                    .setPlaceholder(`Insira um nome ou id de um emoji do servidor.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }
            if (process.env.TICKET_ENABLED === 'true' && interaction.customId.startsWith('definiraparencia')) {



                const modalaAA = new ModalBuilder()
                    .setCustomId('0-89du0awd8awdaw8daw')
                    .setTitle(`Editar Ticket`);

                const dd = tickets.get(`tickets.aparencia`)

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`TITULO`)
                    .setPlaceholder(`Insira aqui um nome, como: Entrar em contato`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(dd?.title == undefined ? '' : dd.title)
                    .setRequired(true)


                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`DESCRIÇÃO`)
                    .setPlaceholder(`Insira aqui uma descrição.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(dd?.description == undefined ? '' : dd.description)
                    .setMaxLength(500)
                    .setRequired(true)


                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`BANNER (OPCIONAL)`)
                    .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(dd?.banner == undefined ? '' : dd.banner)
                    .setRequired(false)



                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`COR DO EMBED (OPCIONAL)`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: FFFFFF`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(dd?.color == undefined ? '' : dd.color)
                    .setRequired(false)


                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);

                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);



            }

            if (process.env.TICKET_ENABLED === 'true' && interaction.customId.startsWith('painelconfigticket')) {


                painelTicket(interaction)


            }



            if (interaction.customId.startsWith('personalizarbot')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111231idsjjs123dua123')
                    .setTitle(`Editar perfil do bot`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`NOME DE USUÁRIO`)
                    .setValue(`${client.user.username}`)
                    .setPlaceholder(`Insira um nome de usuário (só pode mudar 3x por hora)`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`AVATAR`)
                    .setPlaceholder(`Insira uma URL de um ícone`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`STATUS 1`)
                    .setPlaceholder(`Insira aqui um status personalizado`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`STATUS 2`)
                    .setPlaceholder(`Insira aqui um status personalizado`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);

                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);

            }


            if (interaction.customId.startsWith('coresembeds')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjs123dua123')
                    .setTitle(`Editar cores dos embeds`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`COR PRINCIPAL`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #Obd4cd`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`COR DE PROCESSAMENTO`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #fcba03`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`COR DE SUCESSO`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #39fc03`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`COR DE FALHA`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #ff0000`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('tokenMP6')
                    .setLabel(`COR DE FINALIZADO`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #7363ff`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);



                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId.startsWith('voltar2')) {

                Gerenciar(interaction, client)

            }

            if (interaction.customId.startsWith('eaffaawwawa')) {
                automatico(interaction, client)
            }

            if (interaction.customId.startsWith('voltarautomaticos')) {
                automatico(interaction, client)
            }

            if (interaction.customId.startsWith('configauth')) {
                configauth(interaction, client)
            }

            if (interaction.customId.startsWith('gerenciarconfigs')) {
                Gerenciar(interaction, client)
            }

            if (interaction.customId.startsWith('configcargos')) {
                ConfigRoles(interaction, client)
            }
            if (interaction.customId.startsWith('painelpersonalizar')) {


                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("coresembeds")
                            .setLabel('Editar cores dos embeds')
                            .setEmoji(`<:artesvendas:1245085149574594611>`)
                            .setStyle(1),

                        new ButtonBuilder()
                            .setCustomId("personalizarbot")
                            .setLabel('Personalizar Bot')
                            .setEmoji(`<:arte:1237983089523949669> `)
                            .setStyle(1),

                        new ButtonBuilder()
                            .setCustomId("definirtema")
                            .setLabel('Definir tema')
                            .setEmoji(`<:etiqueta_ghost:1327003124350587012>`)
                            .setDisabled(true)
                            .setStyle(1)
                    )

                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("voltar00")
                            .setLabel('Voltar')
                            .setEmoji(`<:emoji_44:1319752370183471256>`)
                            .setStyle(2)
                    )

                interaction.update({ embeds: [], components: [row2, row3], content: `Escolha uma opção e use sua criatividade e profissionalismo ;) ` })


            }
            if (interaction.customId.startsWith('painelconfigbv')) {

                msgbemvindo(interaction, client)

            }

            if (interaction.customId.startsWith('voltar3')) {

                Gerenciar2(interaction, client)

            }

            if (interaction.customId.startsWith('voltar00')) {

                Painel(interaction, client)

            }


            if (interaction.customId.startsWith('painelconfigvendas')) {


                Gerenciar2(interaction, client)





            }



        }
    }
}