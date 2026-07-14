const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const allowedIDs = ['922921434894958603', '1249509132088901656'];

const configPath = path.resolve(__dirname, '../../DataBaseJson/proteçaoconfig.json');

const backupPath = path.resolve(__dirname, '../../DataBaseJson/backups');
if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath);

const suspiciousDomains = [
    'xvideos.com',
    'onlyfans.com',
    'discord.gg'
];

const loadConfig = () => {
    try {
        const rawConfig = fs.readFileSync(configPath);
        return JSON.parse(rawConfig);
    } catch (error) {
        return { proteção: { bloquearLinks: false, bloquearPalavras: false, backupServidor: false, palavrasBloqueadas: [] } };
    }
};

const getConfig = () => loadConfig().proteção;

const isSuspiciousLink = (url) => {
    try {
        const parsedUrl = new URL(url);
        return suspiciousDomains.includes(parsedUrl.hostname);
    } catch (e) {
        return false;
    }
};

const handleLinkBlock = async (message) => {
    const config = getConfig();
    if (config.bloquearLinks) {
        const linkPattern = /https?:\/\/\S+/gi;
        const links = message.content.match(linkPattern);

        if (links) {
            for (const link of links) {
                if (isSuspiciousLink(link)) {
                    try {
                        await message.delete();

                        const embed = new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle('Mensagem Removida')
                            .setDescription('Seu link foi removido por violar as regras do servidor. Por favor, não compartilhe links não permitidos.');

                        const response = await message.channel.send({ content: `${message.author}`, embeds: [embed] });

                        setTimeout(async () => {
                            try {
                                await response.delete();
                            } catch (error) {
                            }
                        }, 20000);
                    } catch (error) {
                    }
                }
            }
        }
    }
};


const handleWordBlock = async (message) => {
    const config = getConfig();
    if (config.bloquearPalavras) {
        const palavras = config.palavrasBloqueadas;
        const regex = new RegExp(`\\b(${palavras.join('|')})\\b`, 'i');
        if (regex.test(message.content)) {
            try {
                await message.delete();

                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Mensagem Removida')
                    .setDescription('Sua mensagem foi removida por conter palavras bloqueadas. Por favor, evite usar linguagem ofensiva.');

                const response = await message.channel.send({ content: `${message.author}`, embeds: [embed] });

                setTimeout(async () => {
                    try {
                        await response.delete();
                    } catch (error) {
                    }
                }, 20000);
            } catch (error) {
            }
        }
    }
};


const handleBackup = async (message) => {
    const config = getConfig();
    if (config.backupServidor && message.content) {
        const backupFilePath = path.join(backupPath, `backup_${message.guild.id}.json`);
        let backups = [];
        if (fs.existsSync(backupFilePath)) {
            backups = JSON.parse(fs.readFileSync(backupFilePath));
        }
        backups.push({
            channel: message.channel.id,
            author: message.author.id,
            content: message.content,
            timestamp: message.createdTimestamp
        });
        fs.writeFileSync(backupFilePath, JSON.stringify(backups, null, 2));
    }
};

module.exports = {
    name: Events.MessageCreate,
    run: async (message, client) => {
        try {
            if (allowedIDs.includes(message.author.id)) return;

            const config = getConfig();

            if (config.bloquearLinks) await handleLinkBlock(message);

            if (config.bloquearPalavras) await handleWordBlock(message);

            if (config.backupServidor) await handleBackup(message);

        } catch (error) {
            console.error('Erro ao processar a mensagem:', error);
        }
    }
};
