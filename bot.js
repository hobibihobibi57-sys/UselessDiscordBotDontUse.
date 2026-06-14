process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Rejection:", err);
});

const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

// ================= MODULES =================
const { getFunFact } = require("./funfact.js");
const economy = require("./economy.js");
const purge = require("./purge.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "%";
const TOKEN = process.env.TOKEN;

// ================= MAX TIMEOUT =================
const MAX_TIMEOUT_MS = 365 * 24 * 60 * 60 * 1000;

// ================= READY =================
client.once("ready", () => {
    console.log(`🐮 Logged in as ${client.user.tag}`);
});

// ================= TIME PARSER =================
function parseDuration(input) {
    if (!input) return null;

    const match = input.match(/^(\d+)([mhdw])$/i);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    const limits = { m: 59, h: 23, d: 6, w: 52 };

    if (value < 1 || value > limits[unit]) return null;

    let ms = 0;

    if (unit === "m") ms = value * 60 * 1000;
    if (unit === "h") ms = value * 60 * 60 * 1000;
    if (unit === "d") ms = value * 24 * 60 * 60 * 1000;
    if (unit === "w") ms = value * 7 * 24 * 60 * 60 * 1000;

    return Math.min(ms, MAX_TIMEOUT_MS);
}

// ================= COMMANDS =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // ================= ECONOMY =================
    if (economy.handleCommand(message, command, args)) return;

        // ================= HELP =================
    if (command === "help") {
        return message.reply(
`🐮 **Capo Mucca Help**

📚 Generale
%help - mostra questo messaggio
%funfact - mostra un fatto casuale

💰 Economia
%work - guadagna 50 Moo Coins
%gamble <amount> - scommetti Moo Coins
%give <amount> @user - dai Moo Coins
%leaderboard - classifica Moo Coins

🛡️ Moderazione
%ban @user - banna un utente
%kick @user - espelle un utente
%timeout @user 1m|1h|1d|1w - timeout
%untimeout @user - rimuove il timeout

🧹 Pulizia
%purge after <message id> - cancella tutti i messaggi dopo quel messaggio

🐮 Moo!`
        );
    }
    
    // ================= FUNFACT =================
    if (command === "funfact") {
        return message.reply(getFunFact());
    }

    // ================= BAN =================
    if (command === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("❌ No permessi.");

        const id = args[0]?.replace(/[<@!>]/g, "");
        if (!id) return message.reply("Uso: %ban @user");

        try {
            await message.guild.members.ban(id);
            return message.reply(`❗ Moo! Ho bannato questa persona! moo!\n\n${getFunFact()}`);
        } catch (err) {
            console.error(err);
            return message.reply("Errore nel ban.");
        }
    }

    // ================= KICK =================
    if (command === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("❌ No permessi.");

        const id = args[0]?.replace(/[<@!>]/g, "");
        if (!id) return message.reply("Uso: %kick @user");

        try {
            const member = await message.guild.members.fetch(id);
            await member.kick();

            return message.reply(`❗ Moo! Ho espulso questa persona! moo!\n\n${getFunFact()}`);
        } catch (err) {
            console.error(err);
            return message.reply("Errore nel kick.");
        }
    }

    // ================= TIMEOUT =================
    if (command === "timeout") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("❌ No permessi.");

        const id = args[0]?.replace(/[<@!>]/g, "");
        const duration = args[1];

        if (!id || !duration) {
            return message.reply("Uso: %timeout @user 1m|1h|1d|1w");
        }

        const ms = parseDuration(duration);
        if (!ms) return message.reply("Durata non valida.");

        try {
            const member = await message.guild.members.fetch(id);
            await member.timeout(ms);

            return message.reply(`❗ Moo! Ho timeoutato questa persona! moo!\n\n${getFunFact()}`);
        } catch (err) {
            console.error(err);
            return message.reply("Errore nel timeout.");
        }
    }

    // ================= UNTIMEOUT =================
    if (command === "untimeout") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("❌ No permessi.");

        const id = args[0]?.replace(/[<@!>]/g, "");

        if (!id) {
            return message.reply("Uso: %untimeout @user");
        }

        try {
            const member = await message.guild.members.fetch(id);

            await member.timeout(null);

            return message.reply(
                `❗ Moo! Ho rimosso il timeout da questa persona! moo!\n\n${getFunFact()}`
            );
        } catch (err) {
            console.error(err);
            return message.reply("Errore nell'untimeout.");
        }
    }

}); // <-- IMPORTANT: closes messageCreate

// ================= LOGIN =================
client.login(TOKEN);
