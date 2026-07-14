const fs = require("fs")

module.exports = {

  run: (client) => {

    const SlashsArray = []

    fs.readdir(`././ComandosSlash/`, (erro, pasta) => {
      pasta.forEach(subpasta => {
        fs.readdir(`././ComandosSlash/${subpasta}/`, (erro, arquivos) => {
          arquivos.forEach(arquivo => {
            if (!arquivo?.endsWith('.js')) return;

            const isTicketFile = ['archive_ticket.js', 'close_ticket.js'].includes(arquivo);
            if (isTicketFile && process.env.TICKET_ENABLED !== 'true') return;

            arquivo = require(`../ComandosSlash/${subpasta}/${arquivo}`);
            if (!arquivo?.name) return;
            client.slashCommands.set(arquivo?.name, arquivo);
            SlashsArray.push(arquivo)
          });
        });
      });
    });

    client.on("ready", async () => {

     

      client.application.commands.set(SlashsArray);

    })
  }
}
