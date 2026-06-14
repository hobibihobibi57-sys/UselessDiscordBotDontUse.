const coins = {};
const workCooldown = {};
const gambleCooldown = {};

const WORK_COOLDOWN = 15000;
const GAMBLE_COOLDOWN = 15000;

function handleCommand(message, command, args) {
    const userId = message.author.id;

    // ================= WORK =================
    if (command === "work") {
        if (workCooldown[userId] && Date.now() - workCooldown[userId] < WORK_COOLDOWN) {
            return message.reply("🐮 Devi aspettare prima di lavorare di nuovo!");
        }

        workCooldown[userId] = Date.now();

        coins[userId] = (coins[userId] || 0) + 50;

        message.reply("🐮 Hai guadagnato 50 Moo Coins!");
        return true;
    }

    // ================= GAMBLE =================
    if (command === "gamble") {
        const amount = parseInt(args[0]);

        if (!amount) {
            message.reply("Uso: %gamble 50");
            return true;
        }

        if (gambleCooldown[userId] && Date.now() - gambleCooldown[userId] < GAMBLE_COOLDOWN) {
            message.reply("🐮 cooldown! aspetta 15 secondi.");
            return true;
        }

        const balance = coins[userId] || 0;
        if (balance < amount) {
            message.reply("🐮 Non hai abbastanza Moo Coins!");
            return true;
        }

        gambleCooldown[userId] = Date.now();

        const win = Math.random() < 0.5;

        coins[userId] = win ? balance + amount : balance - amount;

        message.reply(win ? "🐮 HAI VINTO!" : "🐮 HAI PERSO!");
        return true;
    }

    // ================= LEADERBOARD =================
    if (command === "leaderboard") {
        const sorted = Object.entries(coins)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const text = sorted.length
            ? sorted.map((x, i) => `${i + 1}. <@${x[0]}> - ${x[1]} 🐮`).join("\n")
            : "Nessun dato ancora.";

        message.reply(`🐮 **Leaderboard**\n\n${text}`);
        return true;
    }

    return false;
}

module.exports = { handleCommand };
