process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

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

// ================= ECONOMY =================
const coins = {};
const gambleCooldown = {};
const WORK_COOLDOWN = 15000;
const GAMBLE_COOLDOWN = 15000;

// ================= FUN FACTS (186 TOTAL) =================
const funFacts = [
/* COMMON (100) */
"Le mucche sono animali erbivori.","Le mucche producono latte.","Le mucche vivono in gruppo.","Le mucche muggiscono.",
"Le mucche hanno quattro stomaci.","Le mucche dormono sdraiate.","Le mucche bevono acqua.","Le mucche hanno memoria.",
"Le mucche riconoscono persone.","Le mucche seguono il branco.","Le mucche vivono in fattorie.","Le mucche sono allevate per latte.",
"Le mucche sono allevate per carne.","Le mucche mangiano erba.","Le mucche mangiano fieno.","Le mucche si muovono lentamente.",
"Le mucche hanno vista laterale ampia.","Le mucche reagiscono ai suoni.","Le mucche seguono routine.","Le mucche sono animali domestici.",
"Le mucche vivono in pascoli.","Le mucche producono metano.","Le mucche possono avere corna.","Le mucche vengono munte ogni giorno.",
"Le mucche sono tranquille.","Le mucche riconoscono allevatori.","Le mucche sono da reddito.","Le mucche sono studiate in zootecnia.",
"Le mucche rigurgitano il cibo.","Le mucche sono ruminanti.","Le mucche producono latte per vitelli.","Le mucche seguono il leader.",
"Le mucche possono essere vaccinate.","Le mucche sono monitorate.","Le mucche sono importanti per agricoltura.",
"Le mucche sono diffuse nel mondo.","Le mucche sono grandi animali.","Le mucche sono lente ma costanti.",
"Le mucche vivono all’aperto.","Le mucche sono sensibili allo stress.","Le mucche hanno cicli di vita lunghi.",
"Le mucche sono fondamentali per il latte.","Le mucche sono essenziali per il cibo umano.",
"Le mucche sono allevate globalmente.","Le mucche sono sociali.","Le mucche sono importanti per economia.",
"Le mucche sono robuste.","Le mucche sono calme.","Le mucche producono latte ogni giorno.",
"Le mucche sono essenziali per agricoltura.","Le mucche sono animali agricoli.",
"Le mucche sono presenti ovunque.","Le mucche sono importanti per l’uomo.",
"Le mucche sono allevate per prodotti caseari.","Le mucche sono diffuse globalmente.",

/* UNCOMMON (50) */
"Le mucche scelgono amici.","Le mucche si stressano se isolate.","Le mucche riconoscono volti umani.",
"Le mucche hanno gerarchie sociali.","Le mucche mostrano curiosità.","Le mucche reagiscono alla voce.",
"Le mucche ricordano percorsi.","Le mucche apprendono routine.","Le mucche mostrano empatia.",
"Le mucche hanno personalità.","Le mucche formano legami.","Le mucche comunicano posture.",
"Le mucche riconoscono suoni.","Le mucche evitano conflitti.","Le mucche cooperano.",
"Le mucche hanno memoria sociale.","Le mucche si adattano.","Le mucche sono intelligenti socialmente.",
"Le mucche Wagyu sono pregiate.","Le mucche Angus sono comuni.","Le mucche da latte producono più latte.",
"Le mucche da carne sviluppano muscoli.","Le mucche apprendono.","Le mucche riconoscono segnali.",
"Le mucche reagiscono allo stress.","Le mucche si legano agli allevatori.","Le mucche sono curiose.",
"Le mucche riconoscono individui.","Le mucche comunicano bisogni.","Le mucche apprendono tra loro.",
"Le mucche mostrano comportamento complesso.","Le mucche evitano pericoli.","Le mucche hanno memoria spaziale.",

/* RARE (25) */
"Le mucche sognano.","Ogni mucca ha naso unico.","Le mucche ricordano anni.",
"Le mucche provano emozioni complesse.","Le mucche possono essere gelose.",
"Le mucche riconoscono luoghi.","Le mucche piangono sotto stress.",
"Le mucche hanno memoria lunga.","Le mucche distinguono persone.",
"Le mucche ricordano eventi.","Le mucche hanno empatia avanzata.",
"Le mucche riconoscono voci.","Le mucche hanno preferenze.",
"Le mucche sviluppano legami profondi.","Le mucche hanno cognizione complessa.",
"Le mucche ricordano percorsi complessi.","Le mucche reagiscono emozioni umane.",
"Le mucche riconoscono emozioni umane.","Le mucche apprendono esperienze.",
"Le mucche hanno intelligenza avanzata.","Le mucche ricordano individui per anni.",
"Le mucche mostrano dolore sociale.","Le mucche hanno forte memoria sociale.",
"Le mucche possono ricordare eventi passati per anni.",

/* LEGENDARY */
"Il mio sviluppatore è Fluffy, mi ha creato il 14 di Giugno 2026!",
"Fleqx è un larper dalla nascita!",
"Asianfish è un amante di bistecche!",
"Voxzy ha una voce profonda da sempre!",

/* MYTHIC */
"Tu usi i miei commandi, Io ti do un fun fact mitico...",
"Ci sono esattamente 187 Fun fact, lo sapevi?",
"Il mio anime preferito è Re:Zero!",
"La mia canzone preferita è 2008 Toyota Corolla...",

/* GODLY */
"Dovresti guardare questo video: https://youtu.be/khTYRL0FktE",
"Ti immagini una mucca divina? potrei essere io...",

/* ??? */
"... https://youtu.be/ROtQxmDyJBU"
];

// ================= PICK FACT =================
function pickFact() {
    const f = funFacts[Math.floor(Math.random() * funFacts.length)];
    return `🐮 Fun fact:\n${f}, Moo! 🐮\n⭐ Rarità: Unknown ⭐`;
}

// ================= BOT =================
client.once("ready", () => {
    console.log(`🐮 Online ${client.user.tag}`);
});

client.on("messageCreate", async (m) => {
    if (!m.guild || m.author.bot) return;
    if (!m.content.startsWith(PREFIX)) return;

    const args = m.content.slice(1).trim().split(/\s+/);
    const cmd = args.shift().toLowerCase();

    // ================= FUNFACT =================
    if (cmd === "funfact") return m.reply(pickFact());

    // ================= WORK =================
    if (cmd === "work") {
        coins[m.author.id] = (coins[m.author.id] || 0) + 50;
        return m.reply("🐮 +50 coins!");
    }

    // ================= GAMBLE =================
    if (cmd === "gamble") {
        const id = m.author.id;
        const amount = parseInt(args[0]);

        if (!amount) return m.reply("usa %gamble 50");

        if (gambleCooldown[id] && Date.now() - gambleCooldown[id] < GAMBLE_COOLDOWN)
            return m.reply("🐮 aspetta 15 secondi!");

        gambleCooldown[id] = Date.now();

        if ((coins[id] || 0) < amount)
            return m.reply("non hai abbastanza coins");

        const win = Math.random() < 0.5;

        coins[id] = win
            ? coins[id] + amount
            : coins[id] - amount;

        return m.reply(win ? "🐮 HAI VINTO!" : "🐮 HAI PERSO!");
    }

    // ================= HELP =================
    if (cmd === "help") {
        return m.reply(`🐮 Moo Bot Help
%funfact
%work
%gamble
%leaderboard
%ban %kick %timeout %untimeout
🐮`);
    }

    // ================= MODERATION =================
    async function mod(action, text, id, guild) {
        const member = await guild.members.fetch(id);

        const fact = pickFact();

        return `${text}\n\n${fact}`;
    }

    if (cmd === "ban") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        await m.guild.members.ban(id);
        return m.reply(await mod("Ho bannato questa persona! moo!", id, m.guild));
    }

    if (cmd === "kick") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        const member = await m.guild.members.fetch(id);
        await member.kick();
        return m.reply(await mod("Ho espulso questa persona! moo!", id, m.guild));
    }

    if (cmd === "timeout") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        const member = await m.guild.members.fetch(id);
        await member.timeout(60 * 1000);
        return m.reply(await mod("Ho timeoutato questa persona! moo!", id, m.guild));
    }
});

client.login(TOKEN);
