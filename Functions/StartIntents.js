const token = process.env.DISCORD_TOKEN;

function AtivarIntents() {

    fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bot ${token}`,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const url = `https://discord.com/api/v9/applications/${data.id}`;
            fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "flags": 8953856,

                }),
            });

        })
}




module.exports = {
    AtivarIntents
}
