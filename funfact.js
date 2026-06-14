// ================= FUN FACTS =================

const funFacts = [

/* ===== COMUNE ===== */

{ text: "Le mucche sono animali erbivori.", rarity: "Comune" },
{ text: "Le mucche hanno quattro stomaci.", rarity: "Comune" },
{ text: "Le mucche producono latte.", rarity: "Comune" },
{ text: "Le mucche pascolano nei campi.", rarity: "Comune" },
{ text: "Le mucche vivono in gruppo.", rarity: "Comune" },
{ text: "Le mucche comunicano con muggiti.", rarity: "Comune" },
{ text: "Le mucche dormono molte ore al giorno.", rarity: "Comune" },
{ text: "Le mucche bevono molta acqua.", rarity: "Comune" },
{ text: "Le mucche hanno zoccoli.", rarity: "Comune" },
{ text: "Le mucche hanno una coda per scacciare insetti.", rarity: "Comune" },

{ text: "Le mucche sono mammiferi.", rarity: "Comune" },
{ text: "Le mucche sono allevate in tutto il mondo.", rarity: "Comune" },
{ text: "Le mucche mangiano erba.", rarity: "Comune" },
{ text: "Le mucche ruminano il cibo.", rarity: "Comune" },
{ text: "Le mucche possono stare in piedi per ore.", rarity: "Comune" },
{ text: "Le mucche hanno un ottimo olfatto.", rarity: "Comune" },
{ text: "Le mucche hanno grandi occhi laterali.", rarity: "Comune" },
{ text: "Le mucche sono animali sociali.", rarity: "Comune" },
{ text: "Le mucche si muovono lentamente.", rarity: "Comune" },
{ text: "Le mucche vivono in stalle o pascoli.", rarity: "Comune" },

{ text: "Le mucche possono riconoscere suoni familiari.", rarity: "Comune" },
{ text: "Le mucche sono animali domestici.", rarity: "Comune" },
{ text: "Le mucche possono correre se spaventate.", rarity: "Comune" },
{ text: "Le mucche hanno bisogno di spazio.", rarity: "Comune" },
{ text: "Le mucche sono importanti per l’agricoltura.", rarity: "Comune" },

/* ===== NON COMUNE ===== */

{ text: "Le mucche riconoscono i volti umani.", rarity: "Non comune" },
{ text: "Le mucche possono avere amici preferiti.", rarity: "Non comune" },
{ text: "Le mucche ricordano altre mucche per anni.", rarity: "Non comune" },
{ text: "Le mucche comunicano con la postura.", rarity: "Non comune" },
{ text: "Le mucche possono provare stress.", rarity: "Non comune" },

{ text: "Le mucche mostrano curiosità verso oggetti nuovi.", rarity: "Non comune" },
{ text: "Le mucche possono imparare osservando.", rarity: "Non comune" },
{ text: "Le mucche riconoscono la voce umana.", rarity: "Non comune" },
{ text: "Le mucche sviluppano routine personali.", rarity: "Non comune" },
{ text: "Le mucche preferiscono ambienti tranquilli.", rarity: "Non comune" },

/* ===== RARA ===== */

{ text: "Ogni mucca ha un'impronta del naso unica.", rarity: "Rara" },
{ text: "Le mucche possono sognare durante il sonno.", rarity: "Rara" },
{ text: "Le mucche mostrano emozioni complesse.", rarity: "Rara" },
{ text: "Le mucche possono ricordare eventi a lungo termine.", rarity: "Rara" },
{ text: "Le mucche possono risolvere problemi semplici.", rarity: "Rara" },

/* ===== LEGENDARIA ===== */

{ text: "Il mio sviluppatore è Fluffy, mi ha creato il 14 di Giugno 2026!", rarity: "Leggendaria" },
{ text: "Fleqx è un larper dalla nascita!", rarity: "Leggendaria" },
{ text: "Asianfish è un amante di bistecche!", rarity: "Leggendaria" },
{ text: "Voxzy ha una voce super profonda da quando è piccolo!", rarity: "Leggendaria" },

/* ===== MITICO ===== */

{ text: "Tu usi i miei commandi, Io ti do un fun fact mitico... Va bene?", rarity: "Mitico" },
{ text: "Ci sono esattamente 187 Fun fact, lo sapevi?", rarity: "Mitico" },
{ text: "Il mio anime preferito è Re:Zero!", rarity: "Mitico" },
{ text: "La mia canzone preferita è: 2008 Toyota Corolla...", rarity: "Mitico" },

/* ===== DIVINO ===== */

{ text: "Dovresti guardare questo video: https://youtu.be/khTYRL0FktE", rarity: "Divino" },
{ text: "Ti immagini una mucca divina? Potrei essere io...", rarity: "Divino" },

/* ===== ??? ===== */

{ text: "... https://youtu.be/8V25lkqREVU @here", rarity: "???" }

];

// ================= FUNCTION =================

function getFunFact() {
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];

    return `🐮 **FUN FACT**

${fact.text}

⭐ Rarità: ${fact.rarity}

🐮 Moo!`;
}

// ================= EXPORT =================

module.exports = {
    funFacts,
    getFunFact
};
