const coins = {};
const workCooldown = {};
const gambleCooldown = {};
const dailyCooldown = {};
    
const WORK_COOLDOWN = 15000; // 15s
const GAMBLE_COOLDOWN = 15000; // 15s
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

function handleCommand(message, command, args) {
    const userId = message.author.id;

    // ================= WORK =================
    if (command === "work") {
        if (
            workCooldown[userId] &&
            Date.now() - workCooldown[userId] < WORK_COOLDOWN
        ) {
            message.reply("🐮 Devi aspettare prima di lavorare di nuovo!");
            return true;
        }

        workCooldown[userId] = Date.now();

        coins[userId] = (coins[userId] || 0) + 50;

        message.reply(
            `🐮 Hai lavorato duramente e hai guadagnato 50 Moo Coins!\n💰 Saldo: ${coins[userId]}`
        );

        return true;
    }

    // ================= GAMBLE =================
    if (command === "gamble") {
        const amount = parseInt(args[0]);

        if (!amount || amount <= 0) {
            message.reply("Uso: %gamble <amount>");
            return true;
        }

        if (
            gambleCooldown[userId] &&
            Date.now() - gambleCooldown[userId] < GAMBLE_COOLDOWN
        ) {
            message.reply("🐮 Cooldown! Aspetta 15 secondi.");
            return true;
        }

        const balance = coins[userId] || 0;

        if (balance < amount) {
            message.reply("🐮 Non hai abbastanza Moo Coins!");
            return true;
        }

        gambleCooldown[userId] = Date.now();

        const win = Math.random() < 0.5;

        if (win) {
            coins[userId] += amount;

            message.reply(
                `🎉 HAI VINTO!\n💰 +${amount} Moo Coins\nSaldo: ${coins[userId]}`
            );
        } else {
            coins[userId] -= amount;

            message.reply(
                `💀 HAI PERSO!\n💰 -${amount} Moo Coins\nSaldo: ${coins[userId]}`
            );
        }

        return true;
    }

    // ================= GIVE =================
    if (command === "give") {
        const amount = parseInt(args[0]);
        const target = args[1];

        if (!amount || amount <= 0) {
            message.reply("Uso: %give <amount> <@user>");
            return true;
        }

        if (!target) {
            message.reply("Uso: %give <amount> <@user>");
            return true;
        }

        const targetId = target.replace(/[<@!>]/g, "");

        const balance = coins[userId] || 0;

        if (balance < amount) {
            message.reply("🐮 Non hai abbastanza Moo Coins!");
            return true;
        }

        if (targetId === userId) {
            message.reply("🐮 Non puoi dare Moo Coins a te stesso!");
            return true;
        }

        coins[userId] -= amount;
        coins[targetId] = (coins[targetId] || 0) + amount;

        message.reply(
            `🐮 Hai dato ${amount} Moo Coins a <@${targetId}>!\n` +
            `💰 Il tuo saldo: ${coins[userId]} Moo Coins`
        );

        return true;
    }

        // ================= FLIP =================
    if (command === "flip") {
        const result = Math.random() < 0.5 ? "Testa" : "Croce";

        message.reply(
            `🪙 **Testa o Croce...?**\n\n${result}!`
        );

        return true;
    }

    // ================= DAILY =================
    if (command === "daily") {
        if (
            dailyCooldown[userId] &&
            Date.now() - dailyCooldown[userId] < DAILY_COOLDOWN
        ) {
            const remaining =
                DAILY_COOLDOWN - (Date.now() - dailyCooldown[userId]);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            message.reply(
                `🐮 Hai già riscattato il tuo daily!\n⏳ Torna tra ${hours}h ${minutes}m.`
            );

            return true;
        }

        dailyCooldown[userId] = Date.now();

        const reward =
            Math.floor(Math.random() * (325 - 150 + 1)) + 150;

        coins[userId] = (coins[userId] || 0) + reward;

        message.reply(
            `🎁 **Daily Reward!**\n\n` +
            `Hai ricevuto **${reward} Moo Coins!**\n` +
            `💰 Saldo: ${coins[userId]}`
        );

        return true;
    }
    
    // ================= LEADERBOARD =================
    if (command === "leaderboard") {
        const sorted = Object.entries(coins)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const text = sorted.length
            ? sorted
                  .map(
                      (entry, index) =>
                          `${index + 1}. <@${entry[0]}> - ${entry[1]} 🐮`
                  )
                  .join("\n")
            : "Nessun dato ancora.";

        message.reply(
            `🐮 **Leaderboard Moo Coins**\n\n${text}`
        );

        return true;
    }

    return false;
}

module.exports = {
    handleCommand
};
