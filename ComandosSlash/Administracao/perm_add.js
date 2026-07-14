const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "perm_add",
  description: "Use este comando para conceder permissão a um usuário para gerenciar meu sistema.",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
  options: [
    {
      name: "user",
      description: "Usuário que vai receber a permissão",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    const user = interaction.options.getUser('user');
    const dono = require("../../dono.json");

    if (dono.dono !== interaction.user.id) {
      return interaction.reply({ content: `❌ Você não possui permissão para adicionar um usuário na lista de permissões.`, ephemeral: true });
    }

    let perms;
    const filePath = path.join(__dirname, '..', '..', 'DataBaseJson', 'perms.json');
    try {
      if (fs.existsSync(filePath)) {
        perms = require(filePath);
      } else {
        perms = {};
      }
    } catch (error) {
      console.error("Erro ao carregar o arquivo de permissões:", error);
      return interaction.reply({ content: "❌ O arquivo de permissões não pôde ser carregado.", ephemeral: true });
    }

    if (!perms[user.id]) {
      perms[user.id] = user.id;
      try {
        fs.writeFileSync(filePath, JSON.stringify(perms, null, 2));
        interaction.reply({ content: `✅ O usuário ${user} foi adicionado à lista de permissões do BOT.`, ephemeral: true });
      } catch (error) {
        console.error("Erro ao salvar o arquivo de permissões:", error);
        interaction.reply({ content: "❌ Houve um erro ao salvar o arquivo de permissões.", ephemeral: true });
      }
    } else {
      return interaction.reply({ content: `❌ O usuário já possui permissão no BOT.`, ephemeral: true });
    }
  }
}
