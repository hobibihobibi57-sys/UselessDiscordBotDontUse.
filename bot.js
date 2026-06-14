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
} = require('discord.js');

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
const MAX_TIMEOUT_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

// ================= FUN FACTS =================

const funFacts = [
    { text: "Le mucche sono animali erbivori.", rarity: "Comune" },
    { text: "Il manzo è una delle carni più consumate al mondo.", rarity: "Comune" },
    { text: "Le mucche hanno quattro stomaci.", rarity: "Comune" },
    { text: "Le mucche muggiscono per comunicare.", rarity: "Comune" },
    { text: "Il manzo può essere cucinato in molti modi.", rarity: "Comune" },
    { text: "Le mucche vivono in gruppi sociali.", rarity: "Comune" },
    { text: "Il latte proviene dalle mucche.", rarity: "Comune" },
    { text: "Le mucche pascolano nei campi.", rarity: "Comune" },
    { text: "Il manzo contiene proteine.", rarity: "Comune" },
    { text: "Le mucche sono animali tranquilli.", rarity: "Comune" },

    { text: "Le mucche hanno amici preferiti.", rarity: "Non comune" },
    { text: "Il manzo Wagyu è molto pregiato.", rarity: "Non comune" },
    { text: "Le mucche riconoscono i volti umani.", rarity: "Non comune" },
    { text: "Le mucche comunicano con il linguaggio del corpo.", rarity: "Non comune" },
    { text: "Il manzo può essere affumicato.", rarity: "Non comune" },

    { text: "Le mucche possono sognare.", rarity: "Rara" },
    { text: "Ogni mucca ha un naso unico.", rarity: "Rara" },
    { text: "Le mucche possono provare emozioni complesse.", rarity: "Rara" },

    { text: "Il latte è stato una delle prime risorse domesticate dall’uomo.", rarity: "Leggendaria" },
    { text: "Le mucche sono fondamentali nella storia dell’agricoltura.", rarity: "Leggendaria" }
];

// ================= BOT =================

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

// ================= TIME PARSER =================

function parseDuration(input) {
    const match = input.match(/^(\d+)([mhdw])$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    const limits = { m: 59, h: 23, d: 6, w: 52 };

    if (value < 1 || value > limits[unit]) return null;

    let ms = 0;

    if (unit === "m") ms = value * 60 * 1000;
    if (unit === "h") ms = value * 60 * 60 * 1000;
    if (unit === "d") ms = value * 24 * 60 * 60 * 1000;
    if (unit === "w") ms = value * 7 * 24 * 60 * 60 * 1000;

    if (ms > MAX_TIMEOUT_MS) return MAX_TIMEOUT_MS;

    return ms;
}

// ================= FUN FACT =================

function getFunFact() {
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    return `😮 Piccolo fun fact: ${fact.text}\n⭐ Rarità: ${fact.rarity} 🐮`;
}

// ================= COMMANDS =================

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // HELP
    if (command === "help") {
        return message.reply(
`🐮 **Moo Bot Help**

%ban @user - banna un utente
%kick @user - espelle un utente
%timeout @user (1m, 1h, 1d, 1w, MAX) - timeout con durata
%funfact - mostra un fatto casuale

🐮`
        );
    }

    // FUNFACT
    if (command === "funfact") {
        return message.reply(`🐮 **Fun Fact:**\n\n${getFunFact()}`);
    }

    // BAN
    if (command === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("Non hai permessi.");

        const target = args[0];
        if (!target) return message.reply("Uso: %ban @user");

        const userId = target.replace(/[<@!>]/g, "");

        try {
            const member = await message.guild.members.fetch(userId);
            await message.guild.members.ban(userId);

            return message.reply(`❗Moo! Ho bannato ${member.user.tag} Dal Server!❗\n\n${getFunFact()}`);
        } catch (err) {
            console.error(err);
            return message.reply("Errore.");
        }
    }

    // KICK
    if (command === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("Non hai permessi.");

        const target = args[0];
        if (!target) return message.reply("Uso: %kick @user");

        const userId = target.replace(/[<@!>]/g, "");

        try {
            const member = await message.guild.members.fetch(userId);
            await member.kick();

            return message.reply(`❗Moo! Ho espulso ${member.user.tag} Dal Server!❗\n\n${getFunFact()}`);
        } catch (err) {
            console.error(err);
            return message.reply("Errore.");
        }
    }

    // TIMEOUT
    if (command === "timeout") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("Non hai permessi.");

        const target = args[0];
        const duration = args[1];

        const ms = parseDuration(duration);
        if (!ms) return message.reply("Durata non valida.");

        const userId = target.replace(/[<@!>]/g, "");

        try {
            const member = await message.guild.members.fetch(userId);
            await member.timeout(ms);

            return message.reply(`❗Moo! Ho messo in timeout ${member.user.tag} Dal Server!❗\n\n${getFunFact()}`);
        } catch (err) {
            console.error(err);
            return message.reply("Errore.");
        }
    }
});

client.login(TOKEN);
