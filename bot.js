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
const cooldowns = {};
const WORK_COOLDOWN = 15000;

// ================= MAX TIMEOUT =================
const MAX_TIMEOUT_MS = 365 * 24 * 60 * 60 * 1000;

// ================= FUN FACTS (186 TOTAL) =================
const funFacts = [

/* ================= COMMON ================= */
"Le mucche sono animali erbivori.",
"Le mucche producono latte.",
"Le mucche vivono in gruppo.",
"Le mucche muggiscono.",
"Le mucche hanno quattro stomaci.",
"Le mucche dormono sdraiate.",
"Le mucche bevono acqua.",
"Le mucche hanno memoria.",
"Le mucche riconoscono persone.",
"Le mucche seguono il branco.",
"Le mucche vivono in fattorie.",
"Le mucche sono allevate per latte.",
"Le mucche sono allevate per carne.",
"Le mucche mangiano erba.",
"Le mucche mangiano fieno.",
"Le mucche si muovono lentamente.",
"Le mucche hanno vista laterale ampia.",
"Le mucche reagiscono ai suoni.",
"Le mucche seguono routine.",
"Le mucche sono animali domestici.",
"Le mucche vivono in pascoli.",
"Le mucche producono metano.",
"Le mucche possono avere corna.",
"Le mucche possono essere senza corna.",
"Le mucche vengono munte ogni giorno.",
"Le mucche hanno comportamento sociale.",
"Le mucche sono animali tranquilli.",
"Le mucche si calmano con routine.",
"Le mucche riconoscono il loro allevatore.",
"Le mucche sono animali da reddito.",
"Le mucche sono studiate in zootecnia.",
"Le mucche hanno digestione complessa.",
"Le mucche rigurgitano il cibo.",
"Le mucche sono ruminanti.",
"Le mucche producono latte per vitelli.",
"Le mucche hanno emozioni basilari.",
"Le mucche seguono il leader del gruppo.",
"Le mucche possono essere vaccinate.",
"Le mucche sono monitorate.",
"Le mucche sono importanti per agricoltura.",
"Le mucche sono diffuse nel mondo.",
"Le mucche producono pelle.",
"Le mucche sono grandi animali.",
"Le mucche hanno odore caratteristico.",
"Le mucche sono lente ma costanti.",
"Le mucche vivono all’aperto.",
"Le mucche sono sensibili allo stress.",
"Le mucche hanno cicli di vita lunghi.",
"Le mucche sono fondamentali per latte.",
"Le mucche sono essenziali per cibo umano.",
"Le mucche sono allevate globalmente.",
"Le mucche sono animali sociali.",
"Le mucche possono adattarsi.",
"Le mucche sono importanti per economia.",
"Le mucche sono parte dell’agricoltura.",
"Le mucche sono usate per carne bovina.",
"Le mucche sono robuste.",
"Le mucche sono calme.",
"Le mucche sono da pascolo.",
"Le mucche producono latte ogni giorno.",
"Le mucche sono essenziali per agricoltura.",
"Le mucche sono allevate ovunque.",
"Le mucche sono domestiche antiche.",
"Le mucche hanno bisogno di cure.",
"Le mucche sono monitorate digitalmente.",
"Le mucche seguono cani da pastore.",
"Le mucche riconoscono voci.",
"Le mucche seguono percorsi abituali.",
"Le mucche sono stabili.",
"Le mucche sono importanti per latte e carne.",
"Le mucche sono cultura agricola.",
"Le mucche sono globali.",
"Le mucche sono importanti per cibo.",
"Le mucche sono allevate modernamente.",
"Le mucche sono animali principali.",
"Le mucche sono produzione alimentare.",
"Le mucche sono studiate scientificamente.",
"Le mucche sono docili.",
"Le mucche sono per latticini.",
"Le mucche sono antiche.",
"Le mucche sono erbivori ruminanti.",
"Le mucche sono industria alimentare.",
"Le mucche sono agricole.",
"Le mucche sono ovunque.",
"Le mucche sono importanti per l’uomo.",
"Le mucche sono casearie.",
"Le mucche sono allevate ovunque nel mondo.",

/* ================= UNCOMMON ================= */
"Le mucche scelgono amici.",
"Le mucche si stressano se isolate.",
"Le mucche riconoscono volti umani.",
"Le mucche hanno gerarchie sociali.",
"Le mucche mostrano curiosità.",
"Le mucche reagiscono al tono voce.",
"Le mucche ricordano percorsi.",
"Le mucche apprendono routine.",
"Le mucche mostrano empatia.",
"Le mucche hanno personalità.",
"Le mucche formano legami.",
"Le mucche reagiscono allo stress.",
"Le mucche comunicano posture.",
"Le mucche riconoscono suoni.",
"Le mucche evitano conflitti.",
"Le mucche imparano segnali.",
"Le mucche riconoscono il branco.",
"Le mucche sono addestrabili.",
"Le mucche Wagyu sono pregiate.",
"Le mucche Angus sono diffuse.",
"Le mucche da latte producono più latte.",
"Le mucche da carne sviluppano muscoli.",
"Le mucche si adattano ai climi.",
"Le mucche hanno memoria spaziale.",
"Le mucche comunicano suoni.",
"Le mucche reagiscono ai cambiamenti.",
"Le mucche mostrano individualità.",
"Le mucche apprendono.",
"Le mucche evitano pericoli.",
"Le mucche sono guidate facilmente.",
"Le mucche soffrono isolamento.",
"Le mucche preferiscono routine.",
"Le mucche si legano agli allevatori.",
"Le mucche sono curiose.",
"Le mucche riconoscono segnali.",
"Le mucche hanno memoria sociale.",
"Le mucche comunicano bisogni.",
"Le mucche cooperano.",
"Le mucche apprendono tra loro.",
"Le mucche reagiscono emozioni.",
"Le mucche riconoscono individui.",
"Le mucche hanno legami sociali.",
"Le mucche si adattano.",
"Le mucche hanno comportamento complesso.",
"Le mucche riconoscono ambienti.",
"Le mucche sono intelligenti socialmente.",

/* ================= RARE ================= */
"Le mucche sognano.",
"Ogni mucca ha naso unico.",
"Le mucche ricordano anni.",
"Le mucche provano emozioni complesse.",
"Le mucche possono stressarsi profondamente.",
"Le mucche riconoscono luoghi.",
"Le mucche possono piangere.",
"Le mucche hanno memoria lunga.",
"Le mucche distinguono persone.",
"Le mucche ricordano eventi.",
"Le mucche possono essere gelose.",
"Le mucche hanno memoria sociale forte.",
"Le mucche riconoscono voci.",
"Le mucche provano dolore sociale.",
"Le mucche hanno preferenze.",
"Le mucche ricordano umani.",
"Le mucche sviluppano legami profondi.",
"Le mucche mostrano empatia avanzata.",
"Le mucche riconoscono emozioni umane.",
"Le mucche apprendono esperienze.",
"Le mucche ricordano percorsi complessi.",
"Le mucche hanno intelligenza avanzata.",
"Le mucche reagiscono emozioni umane.",
"Le mucche ricordano individui anni dopo.",
"Le mucche hanno cognizione complessa.",

/* ================= LEGENDARY ================= */
"Il mio sviluppatore è Fluffy, mi ha creato il 14 di Giugno 2026!",
"Fleqx è un larper dalla nascita!",
"Asianfish è un amante di bistecche!",
"Voxzy ha una voce profonda da sempre!",

/* ================= MYTHIC ================= */
"Tu usi i miei commandi, Io ti do un fun fact mitico...",
"Ci sono esattamente 187 Fun fact, lo sapevi?",
"Il mio anime preferito è Re:Zero!",
"La mia canzone preferita è 2008 Toyota Corolla...",

/* ================= GODLY ================= */
"Dovresti guardare questo video: https://youtu.be/khTYRL0FktE",
"Ti immagini una mucca divina? potrei essere io...",

/* ================= ??? ================= */
"... https://youtu.be/ROtQxmDyJBU"
];

// ================= FUNCTIONS =================

function pickFact() {
    const f = funFacts[Math.floor(Math.random() * funFacts.length)];
    return `🐮 ${f}`;
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

    // FUNFACT
    if (cmd === "funfact") return m.reply(pickFact());

    // WORK
    if (cmd === "work") {
        coins[m.author.id] = (coins[m.author.id] || 0) + 50;
        return m.reply("🐮 +50 coins");
    }

    // GAMBLE
    if (cmd === "gamble") {
        const amount = parseInt(args[0]);
        if (!amount) return m.reply("use %gamble 50");
        if ((coins[m.author.id] || 0) < amount) return m.reply("no coins");

        const win = Math.random() < 0.5;
        coins[m.author.id] = win
            ? coins[m.author.id] + amount
            : coins[m.author.id] - amount;

        return m.reply(win ? "🐮 WIN!" : "🐮 LOSE!");
    }

    // LEADERBOARD
    if (cmd === "leaderboard") {
        return m.reply(
            Object.entries(coins)
                .sort((a,b)=>b[1]-a[1])
                .slice(0,10)
                .map((x,i)=>`${i+1}. <@${x[0]}> - ${x[1]}`)
                .join("\n") || "empty"
        );
    }

    // HELP
    if (cmd === "help") {
        return m.reply(`🐮
%funfact
%work
%gamble
%leaderboard
%ban
%kick
%timeout
%untimeout
🐮`);
    }

    // BAN
    if (cmd === "ban") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        await m.guild.members.ban(id);
        return m.reply("🐮 banned");
    }

    // KICK
    if (cmd === "kick") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        const member = await m.guild.members.fetch(id);
        await member.kick();
        return m.reply("🐮 kicked");
    }

    // TIMEOUT
    if (cmd === "timeout") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        const member = await m.guild.members.fetch(id);

        let ms = 60 * 1000;
        await member.timeout(ms);
        return m.reply("🐮 timeout");
    }

    // UNTIMEOUT
    if (cmd === "untimeout") {
        if (!m.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return;
        const id = args[0]?.replace(/[<@!>]/g,"");
        const member = await m.guild.members.fetch(id);
        await member.timeout(null);
        return m.reply("🐮 untimeout");
    }
});

client.login(TOKEN);
