const { ChannelType, Permissions, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const automaticosPath = path.resolve(__dirname, '../../DataBaseJson/msgauto.json');

module.exports = {
    name: "ready",
    run: async (client) => {
        let msgData = [];

        const loadMsgData = () => {
            if (fs.existsSync(automaticosPath)) {
                try {
                    msgData = JSON.parse(fs.readFileSync(automaticosPath));
                } catch (error) {
                    msgData = [];
                }
            }
        };

        const sendAutoMessages = async () => {
            const now = Date.now();

            for (const data of msgData) {
                for (const chatId of data.chatIds) {
                    const channel = client.channels.cache.get(chatId);
                    if (channel) {
                        const disabledButton = new ButtonBuilder()
                            .setCustomId('system_message')
                            .setLabel('Mensagem Do Sistema')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true);

                        const row = new ActionRowBuilder().addComponents(disabledButton);

                        const message = await channel.send({
                            content: data.message,
                            components: [row]
                        });

                        setTimeout(() => {
                            message.delete().catch(console.error);
                        }, data.deleteTime * 1000);
                    }
                }
            }
        };

        loadMsgData();

        schedule.scheduleJob('* * * * *', sendAutoMessages);

        chokidar.watch(automaticosPath).on('change', () => {
            loadMsgData();
        });
    }
};
