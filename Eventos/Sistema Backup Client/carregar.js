const fs = require('fs');
const path = require('path');
const { configuracao } = require("../../DataBaseJson");
const ROLE_ID = configuracao.get("ConfigRoles.cargoCliente");
const DATA_FILE = path.resolve(__dirname, '../../DataBaseJson/clients.json');

module.exports = {
    name: 'ready',
    once: true,
    run: async (client) => {
        await reassignRoles(client);
    },
};

async function reassignRoles(client) {
    const data = readDataFile();
    const guild = client.guilds.cache.first();

    if (!guild) {
        console.error("Nenhum servidor encontrado no cache do bot.");
        return;
    }

    const role = guild.roles.cache.get(ROLE_ID);

    if (!role) {
        console.error(`O cargo com ID "${ROLE_ID}" não foi encontrado no servidor "${guild.name}".`);
        return;
    }

    const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(ROLE_ID));

    membersWithRole.forEach(member => {
        const userId = member.id;
        if (!data.includes(userId)) {
            data.push(userId); 
        }
    });

    saveDataFile(data);

    console.log(`Verificados ${membersWithRole.size} membros com o cargo "${role.name}".`);
}

function readDataFile() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
        if (!rawData.trim()) {
            return [];
        }
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Erro ao ler o arquivo de dados: ${error.message}`);
        return [];
    }
}

function saveDataFile(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Erro ao salvar o arquivo de dados: ${error.message}`);
    }
}
