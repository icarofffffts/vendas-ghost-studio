const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "verify",
    description: "Enviar Botão de Verificação",
    type: Discord.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has("Administrator")) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando. 🔴`, ephemeral: true });
            setTimeout(() => { interaction.deleteReply(); }, 3000);
        } else {
            
            const botao = new Discord.ButtonBuilder()
                .setLabel("Verificar-se")
                .setURL("https://tradexauth.squareweb.app/")
                .setStyle("Link");
            const botao2 = new Discord.ButtonBuilder()
                .setCustomId('faq')
                .setLabel('Por que se verificar?')
                .setStyle("Secondary");
            let row = new Discord.ActionRowBuilder().addComponents(botao, botao2);
            
            await interaction.channel.send({ content: "# __Verificação Injetados__\n - Sua verificação é crucial para garantir a segurança do servidor e manter nossa comunidade protegida.\n - Também é essencial concluir a verificação para realizar compras no servidor e não perder o acesso aos nossos serviços.", 
                                             components: [row],
                                             files: ["https://media.discordapp.net/attachments/1287115582432608439/1297026599031406635/Verifique-se_Cloud_Arts.png?ex=67146da6&is=67131c26&hm=3f362d2a6bbada904eebc49261c16dc85a9b545d3cdcb6aa47e222f49c522c48&=&format=webp&quality=lossless"] });
            interaction.reply({ content: `✅`, ephemeral: true });
        }
    }
};