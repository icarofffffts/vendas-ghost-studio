const { ApplicationCommandType } = require("discord.js");
const { GerenciarCampos } = require("../../Functions/GerenciarCampos");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const Discord = require("discord.js");

module.exports = {
  name: "manage_product",
  description: "Use para configurar minhas funções",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
  options: [{ name: "product", description: "-", type: 3, required: true, autocomplete: true }],

  run: async (client, interaction) => {
    const perm = await getPermissions(client.user.id);
    if (perm === null || !perm.includes(interaction.user.id)) {
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    if (!interaction.options._hoistedOptions || !interaction.options._hoistedOptions[0]) {
      return interaction.reply({ content: `Nenhum item registrado em seu BOT`, ephemeral: true });
    }

    const productValue = interaction.options._hoistedOptions[0].value;

    GerenciarCampos(interaction, productValue);
  }
}
