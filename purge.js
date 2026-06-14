const { PermissionsBitField } = require("discord.js");

async function handleCommand(message, command, args) {
    if (command !== "purge") return false;

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        message.reply("❌ Non hai il permesso di gestire i messaggi.");
        return true;
    }

    if (args[0]?.toLowerCase() !== "after") {
        message.reply("Uso: %purge after <messageID>");
        return true;
    }

    const targetMessageId = args[1];

    if (!targetMessageId) {
        message.reply("Uso: %purge after <messageID>");
        return true;
    }

    try {
        const messages = await message.channel.messages.fetch({ limit: 100 });

        const toDelete = messages.filter(
            msg => BigInt(msg.id) > BigInt(targetMessageId)
        );

        if (toDelete.size === 0) {
            message.reply("🐮 Nessun messaggio trovato dopo quell'ID.");
            return true;
        }

        let deleted = 0;

        for (const msg of toDelete.values()) {
            try {
                await msg.delete();
                deleted++;
            } catch {}
        }

        message.channel.send(
            `🐮 Eliminati ${deleted} messaggi dopo l'ID specificato.`
        );

    } catch (err) {
        console.error(err);
        message.reply("❌ Errore durante il purge.");
    }

    return true;
}

module.exports = {
    handleCommand
};
