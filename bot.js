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

const MAX_TIMEOUT_MS = 365 * 24 * 60 * 60 * 1000;

// ================= FUN FACTS =================

const moderationFunFacts = [
    "Le mucche sono animali erbivori.",
    "Le mucche hanno quattro stomaci.",
    "Le mucche producono latte ogni giorno.",
    "Le mucche vivono in gruppi sociali.",
    "Le mucche pascolano nei campi.",
    "Le mucche bevono grandi quantità di acqua.",
    "Le mucche muggiscono per comunicare.",
    "Le mucche sono animali molto tranquilli.",
    "Le mucche sono allevate in tutto il mondo.",
    "Le mucche riconoscono persone familiari."
];

function getModerationFact() {
    const fact =
        moderationFunFacts[
            Math.floor(Math.random() * moderationFunFacts.length)
        ];

    return `🐮 Fun Fact:\n${fact}`;
}

// ================= READY =================

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

// ================= TIME PARSER =================

function parseDuration(input) {
    const match = input.match(/^(\d+)([mhdw])$/);

    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    const limits = {
        m: 59,
        h: 23,
        d: 6,
        w: 52
    };

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

    const args = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/\s+/);

    const command = args.shift().toLowerCase();

    // ================= HELP =================

    if (command === "help") {
        return message.reply(
`🐮 **Moo Bot Help**

%ban @user
%kick @user
%timeout @user 1m|1h|1d|1w

🐮`
        );
    }

    // ================= BAN =================

    if (command === "ban") {
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.BanMembers
            )
        ) {
            return message.reply("Non hai permessi.");
        }

        const target = args[0];

        if (!target) {
            return message.reply("Uso: %ban @user");
        }

        const userId = target.replace(/[<@!>]/g, "");

        try {
            const member =
                await message.guild.members.fetch(userId);

            await message.guild.members.ban(userId);

            return message.reply(
`❗ Moo! Ho bannato ${member.user.tag} dal server! ❗

${getModerationFact()}`
            );
        } catch (err) {
            console.error(err);
            return message.reply("Errore durante il ban.");
        }
    }

    // ================= KICK =================

    if (command === "kick") {
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.KickMembers
            )
        ) {
            return message.reply("Non hai permessi.");
        }

        const target = args[0];

        if (!target) {
            return message.reply("Uso: %kick @user");
        }

        const userId = target.replace(/[<@!>]/g, "");

        try {
            const member =
                await message.guild.members.fetch(userId);

            await member.kick();

            return message.reply(
`❗ Moo! Ho espulso ${member.user.tag} dal server! ❗

${getModerationFact()}`
            );
        } catch (err) {
            console.error(err);
            return message.reply("Errore durante l'espulsione.");
        }
    }

    // ================= TIMEOUT =================

    if (command === "timeout") {
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.ModerateMembers
            )
        ) {
            return message.reply("Non hai permessi.");
        }

        const target = args[0];
        const duration = args[1];

        if (!target || !duration) {
            return message.reply(
                "Uso: %timeout @user 1m|1h|1d|1w"
            );
        }

        const ms = parseDuration(duration);

        if (!ms) {
            return message.reply(
                "Durata non valida."
            );
        }

        const userId = target.replace(/[<@!>]/g, "");

        try {
            const member =
                await message.guild.members.fetch(userId);

            await member.timeout(ms);

            return message.reply(
`❗ Moo! Ho messo in timeout ${member.user.tag}! ❗

⏰ Durata: ${duration}

${getModerationFact()}`
            );
        } catch (err) {
            console.error(err);
            return message.reply(
                "Errore durante il timeout."
            );
        }
    }
});

client.login(TOKEN);
