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

// 🔴 CAUSE #2 DEBUG CHECK (IMPORTANT)
console.log("🔑 TOKEN exists:", !!TOKEN);
console.log("🔑 TOKEN preview:", TOKEN ? TOKEN.slice(0, 10) + "..." : "MISSING");

// 🔴 HARD STOP IF TOKEN IS MISSING
if (!TOKEN) {
    console.error("❌ TOKEN is missing in Railway variables!");
    process.exit(1);
}

const timeoutDurations = {
    "1m": 60 * 1000,
    "5m": 5 * 60 * 1000,
    "10m": 10 * 60 * 1000,
    "30m": 30 * 60 * 1000,

    "1h": 60 * 60 * 1000,
    "2h": 2 * 60 * 60 * 1000,
    "5h": 5 * 60 * 60 * 1000,
    "10h": 10 * 60 * 60 * 1000,

    "1d": 24 * 60 * 60 * 1000,
    "3d": 3 * 24 * 60 * 60 * 1000,
    "5d": 5 * 24 * 60 * 60 * 1000,

    "1w": 7 * 24 * 60 * 60 * 1000,
    "2w": 14 * 24 * 60 * 60 * 1000
};

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // BAN
    if (command === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("You don't have permission to ban members.");

        const target = args[0];
        if (!target)
            return message.reply("Usage: %ban @user or USER_ID");

        try {
            const userId = target.replace(/[<@!>]/g, "");

            await message.guild.members.ban(userId, {
                reason: `Banned by ${message.author.tag}`
            });

            return message.reply(`User ${userId} has been banned.`);
        } catch (err) {
            console.error(err);
            return message.reply("Failed to ban that user.");
        }
    }

    // UNBAN
    if (command === "unban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("You don't have permission to unban members.");

        const target = args[0];
        if (!target)
            return message.reply("Usage: %unban USER_ID");

        try {
            const userId = target.replace(/[<@!>]/g, "");

            await message.guild.members.unban(
                userId,
                `Unbanned by ${message.author.tag}`
            );

            return message.reply(`User ${userId} has been unbanned.`);
        } catch (err) {
            console.error(err);
            return message.reply("Failed to unban that user.");
        }
    }

    // KICK
    if (command === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("You don't have permission to kick members.");

        const target = args[0];
        if (!target)
            return message.reply("Usage: %kick @user or USER_ID");

        try {
            const userId = target.replace(/[<@!>]/g, "");
            const member = await message.guild.members.fetch(userId);

            await member.kick(`Kicked by ${message.author.tag}`);

            return message.reply(`${member.user.tag} has been kicked.`);
        } catch (err) {
            console.error(err);
            return message.reply("Failed to kick that user.");
        }
    }

    // TIMEOUT
    if (command === "timeout") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("You don't have permission to timeout members.");

        const target = args[0];
        const duration = args[1];

        if (!target)
            return message.reply("Usage: %timeout @user TIME");

        if (!duration || !timeoutDurations[duration]) {
            return message.reply(
                "Allowed times: 1m, 5m, 10m, 30m, 1h, 2h, 5h, 10h, 1d, 3d, 5d, 1w, 2w"
            );
        }

        try {
            const userId = target.replace(/[<@!>]/g, "");
            const member = await message.guild.members.fetch(userId);

            await member.timeout(
                timeoutDurations[duration],
                `Timed out by ${message.author.tag}`
            );

            return message.reply(
                `${member.user.tag} has been timed out for ${duration}.`
            );
        } catch (err) {
            console.error(err);
            return message.reply("Failed to timeout that user.");
        }
    }

    // UNTIMEOUT
    if (command === "untimeout") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply("You don't have permission to remove timeouts.");

        const target = args[0];

        if (!target)
            return message.reply("Usage: %untimeout @user or USER_ID");

        try {
            const userId = target.replace(/[<@!>]/g, "");
            const member = await message.guild.members.fetch(userId);

            await member.timeout(
                null,
                `Timeout removed by ${message.author.tag}`
            );

            return message.reply(
                `${member.user.tag}'s timeout has been removed.`
            );
        } catch (err) {
            console.error(err);
            return message.reply("Failed to remove the timeout.");
        }
    }
});

client.login(TOKEN);
