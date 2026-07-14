const {
    EmbedBuilder,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ButtonBuilder,
    ModalBuilder,
    TextInputBuilder,
    StringSelectMenuBuilder,
    ChannelType,
    ButtonStyle
} = require("discord.js");
  
const { xvideos, logs, stock, userss, configuracao } = require("../../DataBaseJson");

  module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
  
        const customId = interaction.customId;
        if(!customId) return;
  
        const guild = interaction.guild;
        const user = interaction.user;

      if (customId === "config_msg") {
        const selectedValue = interaction.values[0];
  
        if (selectedValue === "channel_avaliation") {
          const guildData = await xvideos.get(guild.id);
          const feedbackChannel = guild.channels.cache.get(guildData.channel_feedback);
          interaction.reply({
            embeds: [new EmbedBuilder().setColor(configuracao.get('Cores.Principal') || '0cd4cc').setTitle("❤ Configurar canal de feedback").setDescription(`> Configure o canal de feedbacks do seu servidor\n> Canal Atual: \`${feedbackChannel ? feedbackChannel.name : "Não Configurado."}\``)],
            components: [new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId("channel_avaliation_select").setMaxValues(1).setMinValues(1).setPlaceholder("Selecione um canal"))],
            ephemeral: true
          });
        } else if (selectedValue === "feedbackspermission") {
          const guildData = await xvideos.get(guild.id);
          const feedbackMessages = guildData.feedbacks.length > 1 ? guildData.feedbacks.map((msg, index) => `${index + 1}. **${msg}**`).join("\n") : "`Nenhuma mensagem foi configurada.`";
          interaction.reply({
            embeds: [new EmbedBuilder().setColor(configuracao.get('Cores.Principal') || '0cd4cc').setTitle("✨ Configurar feedbacks permitidos").setDescription("Agora você pode configurar as mensagens que o bot reconhecerá no canal de feedback para oferecer um Presente aos clientes. Por exemplo, se configurar a mensagem **\"10/10\"**, o autor dessa mensagem receberá o Presente.").addFields({ name: "Mensagens permitidas", value: feedbackMessages })],
            components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("config_msgsbutton").setLabel("Configure as mensagens").setStyle(1).setEmoji('🔧'))],
            ephemeral: true
          });
        } else if (selectedValue === "msg_resgate") {
            interaction.reply({
              embeds: [new EmbedBuilder().setColor(configuracao.get('Cores.Principal') || '0cd4cc').setTitle("🔧 Configurar mensagem de resgate").setDescription("> Aqui você pode configurar a mensagem que o autor deverá clicar quando for resgatar o nitro")],
              components: [
                new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId("elements_embed").setMaxValues(1).setMinValues(1).setPlaceholder("Selecione o elemento da embed").addOptions(
                  { label: "Sincronizar as alterações de resgate", emoji: '1246683269445976065', value: "sincronizar" },
                  { label: "Title", description: "Mude o titulo da mensagem de resgate", value: "title", emoji: '✏' },
                  { label: "Description", description: "Mude a descrição da mensagem de resgate", value: "desc", emoji: '📝' },
                  { label: "Color", description: "Mude a cor da mensagem de resgate", value: "color", emoji: '🎨' },
                  { label: "Image", description: "Mude a Imagem da mensagem de resgate", value: 'image', emoji: '🖼' },
                  { label: "Thumbnail", description: "Mude a thumbnail da mensagem de resgate", value: 'thumb', emoji: '🖼' },
                  { label: 'Footer', description: "Mude o footer da mensagem de resgate", value: "footer", emoji: '🗺' }
                )),
                new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId("elements_button").setMaxValues(1).setMinValues(1).setPlaceholder("Selecione o elemento do botão").addOptions(
                  { label: "Mensagem do botão", description: "Mude a mensagem do botão", emoji: '✏', value: "label" },
                  { label: "Emoji do Botão", description: "Mude o emoji do botão", emoji: '👤', value: "emoji" },
                  { label: "Cor do botão", description: "Mude a cor do botão", emoji: '🎨', value: "color" }
                )),
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder().setCustomId("enviar_message").setLabel("Enviar").setStyle(3).setEmoji("<:corrretoverde:1245086497263321118>"),
                  new ButtonBuilder().setCustomId("reset_message").setLabel("Resetar").setStyle(4).setEmoji('<:reload_Ghost:1336227317118144534>'),
                  new ButtonBuilder().setCustomId("visualizar").setLabel("Visualizar").setStyle(1).setEmoji('<:Ghost_preview:1263070544933158913>'),
                  new ButtonBuilder().setCustomId('discohook').setLabel('Importar').setStyle(2).setEmoji('<:download:1319725626046808185>'),
                )
              ],
              ephemeral: true
            });
        } else if (selectedValue === "stock_nitro") {
          const modal = new ModalBuilder().setCustomId("stock_nitro_add").setTitle("Adicionar Stock de Nitro");
          const textInput = new TextInputBuilder().setCustomId('nitros').setLabel("coloque todos os nitros:").setStyle(2).setRequired(true).setPlaceholder("NITRO\nNITRO\nNITRO\nNITRO\nNITRO\nNITRO\nNITRO");
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        }
      }
  
      if (customId === "stock_nitro_add") {
        const nitros = interaction.fields.getTextInputValue('nitros').split("\n");
        interaction.reply({ content: "Todos os Nitros fóram adicionados com sucesso!", ephemeral: true });
        nitros.forEach(async nitro => {
          if (nitro.trim()) {
            await stock.set(nitro, nitro);
          }
        });
      }
  
      if (customId === "discohook") {
        interaction.reply({
          embeds: [new EmbedBuilder().setColor(configuracao.get('Cores.Principal') || '0cd4cc').setTitle("DiscoHook Import - Mensagem de Resgate").setDescription("> Importe uma mensagem do **DiscoHook**")],
          components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setURL("https://discohook.org/").setLabel("DiscoHook Website").setStyle(5), new ButtonBuilder().setCustomId("import").setLabel("Importar").setStyle(3).setEmoji("<:emoji_37:1255938695156994171>"))],
          ephemeral: true
        });
      }
  
      if (customId === "import") {
        const modal = new ModalBuilder().setCustomId("import_modal").setTitle("Importar mensagem do DiscoHook");
        const textInput = new TextInputBuilder().setCustomId("message").setLabel("envie aqui a mensagem do discohook").setStyle(2).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        return interaction.showModal(modal);
      }
  
      if (customId === "import_modal") {
        const message = interaction.fields.getTextInputValue('message');
        const parsedMessage = jsonVali(message);
        if (!parsedMessage) {
          return interaction.reply({ content: "Coloque um JSON Valido!", ephemeral: true });
        }
        await xvideos.set(`${guild.id}.message`, parsedMessage);
        interaction.reply({ content: "JSON importado com sucesso!", ephemeral: true });
      }
  
      if (customId === "enviar_message") {
        interaction.reply({
          embeds: [new EmbedBuilder().setTitle("➡ Enviar mensagem de resgate").setColor(configuracao.get('Cores.Principal') || '0cd4cc').setDescription("> Selecione abaixo o canal que deseja enviar a mensagem de resgate.")],
          components: [new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId("enviar_message_select").setChannelTypes(ChannelType.GuildText).setMaxValues(1).setMinValues(1).setPlaceholder("Selecione um Canal"))],
          ephemeral: true
        });
      }
  
      if (customId === "enviar_message_select") {
        const selectedChannel = guild.channels.cache.get(interaction.values[0]);
        await interaction.deferReply({ ephemeral: true });
        const guildData = await xvideos.get(guild.id);
        const messageData = guildData.message;
        const buttonData = guildData.button;
        selectedChannel.send({
          content: messageData.content,
          embeds: messageData.embeds,
          attachments: messageData.attachments,
          components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("resgatar").setLabel(buttonData.label).setStyle(Number(buttonData.style)).setEmoji(buttonData.emoji))]
        }).then(sentMessage => {
          logs.set(sentMessage.id, { channel: selectedChannel.id, guild: guild.id });
        });
        interaction.editReply({ content: `Mensagem de resgate enviada com sucesso em: ${selectedChannel}` });
      }
  
      if (customId === 'visualizar') {
        const guildData = await xvideos.get(guild.id);
        const messageData = guildData.message;
        const buttonData = guildData.button;
        interaction.reply({
          content: messageData.content,
          embeds: messageData.embeds,
          attachments: messageData.attachments,
          components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("resgatar").setLabel(buttonData.label).setStyle(Number(buttonData.style)).setEmoji(buttonData.emoji).setDisabled(true))],
          ephemeral: true
        });
      }
  
      if (customId === "elements_embed") {
        const selectedElement = interaction.values[0];
  
        if (selectedElement === "title") {
          const modal = new ModalBuilder().setCustomId("title_modal").setTitle("Alterar Título");
          const textInput = new TextInputBuilder().setCustomId("title").setLabel("coloque o novo título:").setStyle(1).setRequired(true).setMaxLength(200);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else if (selectedElement === "desc") {
          const modal = new ModalBuilder().setCustomId("description_modal").setTitle("Alterar Descrição");
          const textInput = new TextInputBuilder().setCustomId("description").setLabel("coloque a nova descrição:").setStyle(2).setRequired(true).setMaxLength(4000);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else if (selectedElement === "color") {
          const modal = new ModalBuilder().setCustomId("color_modal").setTitle("Alterar Cor");
          const textInput = new TextInputBuilder().setCustomId("color").setLabel("coloque a nova cor:").setStyle(1).setRequired(true);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else if (selectedElement === 'thumb') {
          const modal = new ModalBuilder().setCustomId("thumb_modal").setTitle("Alterar Thumbnail");
          const textInput = new TextInputBuilder().setCustomId("thumb").setLabel("coloque a nova thumbnail:").setStyle(1).setRequired(true);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else if (selectedElement === 'image') {
          const modal = new ModalBuilder().setCustomId("image_modal").setTitle("Alterar Imagem");
          const textInput = new TextInputBuilder().setCustomId("image").setLabel("coloque a nova imagem:").setStyle(1).setRequired(true);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else if (selectedElement === "footer") {
          const modal = new ModalBuilder().setCustomId("footer_modal").setTitle("Alterar Footer");
          const textInput1 = new TextInputBuilder().setCustomId('text').setLabel("coloque o texto do footer:").setStyle(1).setRequired(true).setMaxLength(100);
          const textInput2 = new TextInputBuilder().setCustomId('image').setLabel("coloque a imagem do footer:").setStyle(1).setRequired(true).setMaxLength(100);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput1));
          modal.addComponents(new ActionRowBuilder().addComponents(textInput2));
          return interaction.showModal(modal);
        } else if (selectedElement === "sincronizar") {
          await interaction.deferReply({ ephemeral: true });
          const allLogs = (await logs.all()).filter(log => log.value.guild);
          const guildData = await xvideos.get(guild.id);
          const messageData = guildData.message;
          const buttonData = guildData.button;
          for (const log of allLogs) {
            const channelId = log.value.channel;
            const messageId = log.id;
            try {
              const channel = await client.channels.fetch(channelId).catch(() => {});
              if (channel) {
                const message = await channel.messages.fetch(messageId);
                await message.edit({
                  content: messageData.content,
                  embeds: messageData.embeds,
                  attachments: messageData.attachments,
                  components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("resgatar").setLabel(buttonData.label).setStyle(Number(buttonData.style)).setEmoji(buttonData.emoji))]
                });
              }
            } catch (error) {}
          }
          interaction.editReply({ content: "Todas as mensagens de resgate sincronizada com sucesso!" });
        }
      }
  
      if (customId === "elements_button") {
        const selectedElement = interaction.values[0];
  
        if (selectedElement === "label") {
          const modal = new ModalBuilder().setCustomId("label_modal").setTitle("Alterar Mensagem do Botão");
          const textInput = new TextInputBuilder().setCustomId('message').setLabel("mensagem do botão:").setStyle(1).setRequired(true).setMaxLength(50);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else if (selectedElement === "emoji") {
          const modal = new ModalBuilder().setCustomId("emoji_modal").setTitle("Alterar Emoji do Botão");
          const textInput = new TextInputBuilder().setCustomId("emoji").setLabel("emoji do botão:").setStyle(1).setRequired(true);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
          return interaction.showModal(modal);
        } else {
          interaction.reply({
            embeds: [new EmbedBuilder().setTitle("🎨 Cor do botão").setColor(configuracao.get('Cores.Principal') || '0cd4cc').setDescription("Selecione a cor do botão da mensagem de resgate").setImage("https://media.discordapp.net/attachments/1208586056652562434/1266764090467160096/image.png?ex=66a6557e&is=66a503fe&hm=0ef894617e7b656403c87b2a531fce5a4a3fae3654d97b1bed228650c8d43c8b&=&format=webp&quality=lossless&width=400&height=116")],
            components: [new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId("color_select_button").setMaxValues(1).setMinValues(1).addOptions(
              { label: 'Primary', value: '1', emoji: '🔵' },
              { label: "Secundary", value: '2', emoji: '⚫' },
              { label: 'Sucess', value: '3', emoji: '🟢' },
              { label: "Danger", value: '4', emoji: '🔴' }
            ).setPlaceholder("Selecione a cor do Botão"))],
            ephemeral: true
          });
        }
      }
  
      if (customId === "label_modal") {
        const newLabel = interaction.fields.getTextInputValue("message");
        await xvideos.set(`${guild.id}.button.label`, newLabel);
        interaction.reply({ content: `Mensagem do Botão de resgate configurado para: ${newLabel}`, ephemeral: true });
      }
  
      if (customId === "emoji_modal") {
        const newEmoji = interaction.fields.getTextInputValue("emoji");
        await xvideos.set(`${guild.id}.button.emoji`, newEmoji);
        interaction.reply({ content: `Emoji do Botão de resgate configurado para: ${newEmoji}`, ephemeral: true });
      }
  
      if (customId === "color_select_button") {
        const newColor = Number(interaction.values[0]);
        await xvideos.set(`${guild.id}.button.style`, newColor);
        interaction.reply({ content: `Cor do botão da mensagem de resgate configurado para: ${newColor}`, ephemeral: true });
      }
  
      if (interaction.isModalSubmit()) {
        const modalType = customId.split('_')[0];
        const guildId = guild.id;
        let embeds = (await xvideos.get(`${guildId}.message.embeds`)) || [{}];
      
        if (!embeds[0]) {
          embeds[0] = {};
        }
      
        if (modalType === "title" || modalType === "description") {
          embeds[0][modalType] = interaction.fields.getTextInputValue(modalType);
          await xvideos.set(`${guildId}.message.embeds`, embeds);
          interaction.reply({ content: `O ${modalType} foi alterado com sucesso!`, ephemeral: true });
        } else if (modalType === "color") {
          const newColor = interaction.fields.getTextInputValue("color");
          embeds[0].color = newColor;
          interaction.reply({
            embeds: [new EmbedBuilder().setDescription(`Sua nova cor: ${newColor}`).setColor(newColor)],
            ephemeral: true
          }).then(() => xvideos.set(`${guildId}.message.embeds`, embeds)).catch(() => interaction.reply({ content: "Coloque uma cor valida!", ephemeral: true }));
        } else if (modalType === 'thumb') {
          const newThumbnail = interaction.fields.getTextInputValue("thumb");
          embeds[0].thumbnail = { url: newThumbnail };
          interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Sua nova thumbnail:").setThumbnail(newThumbnail)],
            ephemeral: true
          }).then(() => xvideos.set(`${guildId}.message.embeds`, embeds)).catch(() => interaction.reply({ content: "Coloque uma url valida!", ephemeral: true }));
        } else if (modalType === 'image') {
          const newImage = interaction.fields.getTextInputValue('image');
          embeds[0].image = { url: newImage };
          interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Sua nova imagem:").setImage(newImage)],
            ephemeral: true
          }).then(() => xvideos.set(`${guildId}.message.embeds`, embeds)).catch(() => interaction.reply({ content: "Coloque uma url valida!", ephemeral: true }));
        } else if (modalType === "footer") {
          const footerText = interaction.fields.getTextInputValue("text");
          const footerImage = interaction.fields.getTextInputValue('image');
          if (!footerImage.startsWith("https://") && !footerImage.startsWith('http://')) {
            return interaction.reply({ content: "Coloque uma imagem Valida!", ephemeral: true });
          }
          embeds[0].footer = { text: footerText, icon_url: footerImage };
          await xvideos.set(`${guildId}.message.embeds`, embeds);
          interaction.reply({ content: "O footer foi alterado com sucesso!", ephemeral: true });
        }
      }
      
  
      if (customId === "config_msgsbutton") {
        const guildData = await xvideos.get(guild.id);
        const feedbackMessages = guildData.feedbacks.length > 1 ? guildData.feedbacks.join(", ") : "Nenhuma mensagem foi configurada.";
        const modal = new ModalBuilder().setCustomId("config_msgsbutton_modal").setTitle("Configurar feedbacks permitidos");
        const textInput = new TextInputBuilder().setCustomId("msg").setLabel("digite uma mensagem permitida").setStyle(1).setRequired(true).setValue(feedbackMessages);
        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        return interaction.showModal(modal);
      }
  
      if (customId === "config_msgsbutton_modal") {
        const feedbackMessages = interaction.fields.getTextInputValue('msg').split(", ");
        await xvideos.set(`${guild.id}.feedbacks`, feedbackMessages);
        interaction.reply({ content: "Feedbacks alterado com sucesso!", ephemeral: true });
      }
  
      if (customId === "channel_avaliation_select") {
        const selectedChannel = interaction.values[0];
        await xvideos.set(`${guild.id}.channel_feedback`, selectedChannel);
        interaction.reply({ content: `> Canal de feedbacks configurado para: ${selectedChannel}`, ephemeral: true });
      }
  
      if (customId === "reset_message") {
        const defaultMessage = {
          content: "# FEEDBACK\n- Resgate sua recompensa",
          embeds: []
        };
        await xvideos.set(`${guild.id}.message`, defaultMessage);
        const defaultButton = {
          style: 3,
          label: "Resgatar",
          emoji: '🎁'
        };
        await xvideos.set(`${guild.id}.button`, defaultButton);
        interaction.reply({ content: "Mensagem de resgate resetada com sucesso.", ephemeral: true });
      }

      if (customId === "resgatar") {
        await interaction.deferReply({ ephemeral: true });
    
        const guildData = await xvideos.get(guild.id);
        const feedbackChannel = client.channels.cache.get(guildData.channel_feedback);
        
        if (!feedbackChannel) {
            return interaction.followUp({ content: "Canal de FeedBack não foi configurado.", ephemeral: true });
        }
    
        if (userss.get(user.id)) {
            return interaction.followUp({
                content: "❌ Você já resgatou sua recompensa!",
                ephemeral: true
            });
        }
    
        const requiredRoleId = '1250191876133228566';
        const member = await guild.members.fetch(user.id);
    
        if (!member.roles.cache.has(requiredRoleId)) {
            const registerButton = new ButtonBuilder()
                .setLabel('Registrar-se')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/oauth2/authorize?client_id=1241397849195810846&redirect_uri=https://restorecord.com/api/callback&response_type=code&scope=identify+guilds.join+email&state=1250189025189298226');
    
            const row = new ActionRowBuilder().addComponents(registerButton);
    
            return interaction.followUp({
                content: `❌ Você precisa se registrar no botão abaixo para receber o cargo e poder resgatar sua recompensa.`,
                components: [row],
                ephemeral: true
            });
        }
    
        try {
            await interaction.editReply({ content: "Verificando suas mensagens de feedback, por favor, aguarde..." });
    
            const channel = await client.channels.fetch(feedbackChannel.id);
            const fetchedMessages = await channel.messages.fetch({ limit: 100 });
            const messages = Array.from(fetchedMessages.values());
    
            const userMessages = messages.filter(msg => msg.author.id === user.id);
            const isEligible = userMessages.some(msg => guildData.feedbacks.some(feedback => msg.content.includes(feedback)));
            
            if (!isEligible) {
                const feedbackList = guildData.feedbacks.join('\n- ');
    
                try {
                    const role = guild.roles.cache.get('1250837277748494496');
                    if (role) {
                        await member.roles.add(role);
                    }
                } catch (error) {
                }
    
                return interaction.editReply({
                    content: "",
                    embeds: [new EmbedBuilder().setTitle("Você está inelegível para resgatar um nitro.").setColor("Red").setDescription(`Para se tornar elegível, envie um feedback válido!\n\n**Mensagens permitidas:**\n- ${feedbackList}`)],
                    ephemeral: true
                });
            }
    
            const nitroStock = await stock.all(1);
            if (nitroStock.length === 0) {
                return interaction.editReply({ content: "❌ Não há nitros disponíveis no momento. Tente novamente mais tarde." });
            }
    
            const xxxxxxx = new ButtonBuilder()
                .setLabel('Visitar Loja')
                .setEmoji('1266882745569644577')
                .setStyle(ButtonStyle.Link)
                .setURL('discord.gg/w9U3w3kTgu');
    
            const xrow = new ActionRowBuilder().addComponents(xxxxxxx);
    
            const nitro = nitroStock[0];
            await user.send({ components: [xrow], content: `🎉 Parabéns, ${interaction.user.username}! Aqui está seu Nitro:\n\n${nitro.data}\n\n**Visite nossa loja para mais ofertas incríveis!**` }).then(async () => {
                await stock.delete(nitro.ID);
                await userss.set(user.id, user.id);
    
                try {
                  const role = guild.roles.cache.get('1250837277748494496');
                  if (role) {
                      await member.roles.add(role);
                  }
              } catch (error) {
              }
              
                interaction.editReply({ content: "Nitro resgatado com sucesso! Verifique suas mensagens privadas." });
            }).catch(() => {
                interaction.editReply({ content: "Desbloqueie seu privado!" });
            });
        } catch (error) {
            interaction.editReply({ content: "Ocorreu um erro ao buscar suas mensagens. Tente novamente mais tarde." });
        }
    }
  }    
}      

  function jsonVali(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return false;
    }
  }