const ATTRIBUTES = ["STR", "END", "AGI", "SPD", "INT", "WIL", "PER", "LCK"];

const MAGIC_SCHOOLS = ["Conjuration", "Alteration", "Elementalism", "Illusion", "Divination", "Vitalism"];

const APPRENTICE_SPELLS = {
  "Alteration": [
    { name: "Feather", cost: "2 MP", details: "Touch (2m). Target's carry capacity is treated as 30 units lower. 10 minutes." },
    { name: "Burden", cost: "2 MP", details: "Self. Increase carry weight capacity by 50 units. Until next rest." },
    { name: "Open (Lesser)", cost: "2 MP", details: "Touch (2m). Unlock any lock rated below Journeyman difficulty." },
    { name: "Slowfall", cost: "1 MP", details: "Self. Fall safely from any height. Until next rest." }
  ],
  "Conjuration": [
    { name: "Bound Dagger", cost: "2 MP", details: "Self. A bound blade of force, equivalent to a Journeyman-quality dagger. 1 minute." },
    { name: "Summon Minor Creature", cost: "2 MP", details: "Short (10m). Summon a small hostile creature (large-dog equivalent). 1 minute." }
  ],
  "Elementalism": [
    { name: "Spark", cost: "1 MP", details: "Short (10m). Instant. Deals 1d4 shock damage." },
    { name: "Firebolt", cost: "2 MP", details: "Short (10m). Instant. Deals 1d6 fire damage." },
    { name: "Frost Touch", cost: "2 MP", details: "Touch (2m). Instant. Deals 1d6 frost damage; target adds +5 to their next roll (slowed)." }
  ],
  "Illusion": [
    { name: "Light", cost: "1 MP", details: "Self or touch (2m). Bright light, 5m radius. Until next rest." },
    { name: "Night-Eye", cost: "2 MP", details: "Self. See clearly in darkness. Until next rest." },
    { name: "Muffle", cost: "2 MP", details: "Self. Your movement makes no sound. Until next rest." }
  ],
  "Divination": [
    { name: "Detect Life", cost: "2 MP", details: "Self. Sense living creatures within 10m. 1 minute." },
    { name: "Soul Trap", cost: "2 MP", details: "Touch (2m). If target dies within 1 minute, the smallest valid soul gem you own is filled." }
  ],
  "Vitalism": [
    { name: "Restore Health (Minor)", cost: "2 MP", details: "Touch (2m). Restore 1d6+1 HP." },
    { name: "Cure Poison", cost: "2 MP", details: "Touch (2m). Remove one poison effect." },
    { name: "Restore Fatigue", cost: "2 MP", details: "Touch (2m). Instant. Restore 1d6+1 FP." }
  ]
};

const STARTER_WEAPONS = [
  { name: "Iron Dagger", skill: "Short Blade", fp: 1, primary: "1d4 Piercing", secondary: "1d4 Slashing", tags: "THROWN", notes: "Standard sidearm.", price: "15g" },
  { name: "Iron Shortsword", skill: "Short Blade", fp: 1, primary: "1d6 Slashing", secondary: "1d4 Piercing", tags: "", notes: "More robust than a dagger.", price: "30g" },
  { name: "Iron Hand Axe", skill: "Axe", fp: 1, primary: "1d4 Slashing", secondary: "1d4 Crushing", tags: "THROWN", notes: "Slashing on blade, crushing on poll.", price: "30g" },
  { name: "Iron Longsword", skill: "Long Blade", fp: 2, primary: "1d6 Slashing", secondary: "1d6 Piercing", tags: "VERSATILE", notes: "One-handed with shield is +5 to attack roll.", price: "40g" },
  { name: "Iron Mace", skill: "Blunt Weapon", fp: 2, primary: "1d6 Crushing", secondary: "1d4 Piercing", tags: "", notes: "Crushing on head, piercing on spike.", price: "35g" },
  { name: "Iron Spear", skill: "Spear", fp: 2, primary: "1d6 Piercing", secondary: "1d4 Crushing", tags: "REACH", notes: "Thrust or butt-strike.", price: "35g" },
  { name: "Iron Greatsword", skill: "Long Blade", fp: 3, primary: "1d10 Slashing", secondary: "1d8 Piercing", tags: "TWO-HANDED", notes: "Sweep critical can hit adjacent target for 1d4.", price: "70g" },
  { name: "Short Bow + 20 arrows", skill: "Marksman", fp: 1, primary: "1d6 Piercing", secondary: "1d4 Piercing", tags: "RANGED", notes: "Range 10-30m. Secondary is hurried snap-shot.", price: "50g" }
];

const STARTER_ARMOR = [
  { name: "Traveler's Clothes", type: "Unarmored", baseAr: 0, notes: "Use Unarmored skill bonus (skill / 20).", price: "10g" },
  { name: "Leather Armor (full)", type: "Light Armor", baseAr: 2, notes: "Light armor baseline from Chapter 8.", price: "60g" },
  { name: "Chainmail (full)", type: "Medium Armor", baseAr: 4, notes: "Medium armor baseline from Chapter 8.", price: "150g" },
  { name: "Steel Plate (full)", type: "Heavy Armor", baseAr: 6, notes: "Heavy armor baseline from Chapter 8.", price: "450g" }
];

const STARTER_SHIELDS = [
  { name: "No Shield", arBonus: "+0 AR", notes: "No block reaction from shield." },
  { name: "Iron Shield", arBonus: "+1 AR", notes: "Enables Block reaction when wielded." }
];

const STARTER_KITS = [
  { name: "Lockpick Set", price: "20g", notes: "Required for Security checks to pick locks." },
  { name: "Trap Disarming Kit", price: "35g", notes: "Used for trap disarming; without it, disarming is Hard (+10)." },
  { name: "Armorer's Kit", price: "40g", notes: "Field repairs for Worn -> Good weapons/armor." },
  { name: "Alchemical Kit, Basic", price: "50g", notes: "Minimum required for Alchemy rolls." },
  { name: "Enchanting Toolkit", price: "150g", notes: "Required to enchant away from a dedicated table." },
  { name: "Healer's Satchel", price: "30g", notes: "Supports non-magical healing and stabilization." }
];
const NON_COMBAT_SKILLS = [
  "Speechcraft",
  "Mercantile",
  "Alchemy",
  "Enchanting",
  "Conjuration",
  "Alteration",
  "Elementalism",
  "Illusion",
  "Divination",
  "Vitalism",
  "Armorer",
  "Athletics",
  "Acrobatics",
  "Sneak",
  "Security"
];

const SKILL_DEFS = [
  { name: "Long Blade", gov: ["STR", "AGI"] },
  { name: "Short Blade", gov: ["AGI"] },
  { name: "Blunt Weapon", gov: ["STR"] },
  { name: "Axe", gov: ["STR"] },
  { name: "Spear", gov: ["STR", "AGI"] },
  { name: "Marksman", gov: ["AGI"] },
  { name: "Block", gov: ["STR", "AGI"] },
  { name: "Unarmored", gov: ["AGI"] },
  { name: "Light Armor", gov: ["AGI"] },
  { name: "Medium Armor", gov: ["END"] },
  { name: "Heavy Armor", gov: ["END", "STR"] },
  { name: "Athletics", gov: ["SPD", "END"] },
  { name: "Acrobatics", gov: ["AGI"] },
  { name: "Sneak", gov: ["AGI"] },
  { name: "Security", gov: ["AGI", "INT"] },
  { name: "Speechcraft", gov: ["PER"] },
  { name: "Mercantile", gov: ["PER", "INT"] },
  { name: "Alchemy", gov: ["INT"] },
  { name: "Enchanting", gov: ["INT", "WIL"] },
  { name: "Conjuration", gov: ["INT", "WIL"] },
  { name: "Alteration", gov: ["INT", "WIL"] },
  { name: "Elementalism", gov: ["INT", "WIL"] },
  { name: "Illusion", gov: ["INT", "PER"] },
  { name: "Divination", gov: ["WIL", "INT"] },
  { name: "Vitalism", gov: ["WIL"] },
  { name: "Armorer", gov: ["STR", "INT"] },
  { name: "Fistfight", gov: ["STR", "AGI"] }
];

const ARCHETYPES = {
  "Knight": {
    attrs: { STR: 65, END: 55, AGI: 35, SPD: 35, INT: 25, WIL: 25, PER: 35, LCK: 30 },
    major: ["Blunt Weapon", "Axe", "Long Blade", "Heavy Armor", "Athletics"],
    minor: ["Block", "Medium Armor", "Speechcraft", "Acrobatics", "Vitalism"]
  },
  "Shield-Brother": {
    attrs: { STR: 55, END: 60, AGI: 45, SPD: 35, INT: 25, WIL: 30, PER: 30, LCK: 25 },
    major: ["Long Blade", "Block", "Heavy Armor", "Athletics", "Vitalism"],
    minor: ["Blunt Weapon", "Medium Armor", "Speechcraft", "Acrobatics", "Short Blade"]
  },
  "Duelist": {
    attrs: { STR: 40, END: 40, AGI: 65, SPD: 50, INT: 25, WIL: 25, PER: 35, LCK: 30 },
    major: ["Short Blade", "Long Blade", "Acrobatics", "Light Armor", "Athletics"],
    minor: ["Block", "Sneak", "Marksman", "Unarmored", "Speechcraft"]
  },
  "Ranger": {
    attrs: { STR: 35, END: 45, AGI: 65, SPD: 45, INT: 30, WIL: 25, PER: 25, LCK: 35 },
    major: ["Marksman", "Sneak", "Light Armor", "Athletics", "Short Blade"],
    minor: ["Acrobatics", "Long Blade", "Alchemy", "Block", "Vitalism"]
  },
  "Crusader": {
    attrs: { STR: 55, END: 55, AGI: 35, SPD: 30, INT: 30, WIL: 55, PER: 35, LCK: 25 },
    major: ["Long Blade", "Heavy Armor", "Vitalism", "Block", "Athletics"],
    minor: ["Blunt Weapon", "Medium Armor", "Speechcraft", "Divination", "Conjuration"]
  },
  "Nightblade": {
    attrs: { STR: 30, END: 35, AGI: 60, SPD: 40, INT: 50, WIL: 40, PER: 35, LCK: 25 },
    major: ["Short Blade", "Sneak", "Illusion", "Acrobatics", "Light Armor"],
    minor: ["Long Blade", "Divination", "Alteration", "Athletics", "Security"]
  },
  "Rogue": {
    attrs: { STR: 30, END: 35, AGI: 60, SPD: 50, INT: 40, WIL: 25, PER: 55, LCK: 40 },
    major: ["Short Blade", "Sneak", "Security", "Acrobatics", "Speechcraft"],
    minor: ["Light Armor", "Marksman", "Mercantile", "Athletics", "Illusion"]
  },
  "Bard": {
    attrs: { STR: 25, END: 35, AGI: 40, SPD: 40, INT: 45, WIL: 35, PER: 70, LCK: 40 },
    major: ["Speechcraft", "Illusion", "Mercantile", "Short Blade", "Acrobatics"],
    minor: ["Vitalism", "Alchemy", "Light Armor", "Athletics", "Sneak"]
  },
  "Spy": {
    attrs: { STR: 25, END: 30, AGI: 45, SPD: 35, INT: 55, WIL: 40, PER: 65, LCK: 35 },
    major: ["Illusion", "Speechcraft", "Sneak", "Mercantile", "Short Blade"],
    minor: ["Alteration", "Divination", "Security", "Acrobatics", "Light Armor"]
  },
  "Fence": {
    attrs: { STR: 30, END: 35, AGI: 45, SPD: 35, INT: 55, WIL: 30, PER: 65, LCK: 50 },
    major: ["Mercantile", "Speechcraft", "Security", "Sneak", "Short Blade"],
    minor: ["Light Armor", "Acrobatics", "Alchemy", "Illusion", "Athletics"]
  },
  "Battle-Mage": {
    attrs: { STR: 45, END: 45, AGI: 35, SPD: 30, INT: 55, WIL: 45, PER: 25, LCK: 30 },
    major: ["Elementalism", "Long Blade", "Medium Armor", "Alteration", "Block"],
    minor: ["Vitalism", "Conjuration", "Athletics", "Heavy Armor", "Divination"]
  },
  "Sorcerer": {
    attrs: { STR: 20, END: 25, AGI: 30, SPD: 30, INT: 75, WIL: 65, PER: 30, LCK: 30 },
    major: ["Elementalism", "Alteration", "Divination", "Conjuration", "Alchemy"],
    minor: ["Illusion", "Vitalism", "Enchanting", "Unarmored", "Short Blade"]
  },
  "Priest": {
    attrs: { STR: 20, END: 40, AGI: 30, SPD: 30, INT: 55, WIL: 70, PER: 45, LCK: 30 },
    major: ["Vitalism", "Divination", "Conjuration", "Alchemy", "Speechcraft"],
    minor: ["Alteration", "Illusion", "Light Armor", "Enchanting", "Athletics"]
  },
  "Summoner": {
    attrs: { STR: 20, END: 30, AGI: 30, SPD: 30, INT: 70, WIL: 65, PER: 30, LCK: 30 },
    major: ["Conjuration", "Divination", "Enchanting", "Alteration", "Alchemy"],
    minor: ["Elementalism", "Vitalism", "Illusion", "Unarmored", "Security"]
  },
  "Illusionist": {
    attrs: { STR: 20, END: 30, AGI: 40, SPD: 35, INT: 65, WIL: 55, PER: 60, LCK: 30 },
    major: ["Illusion", "Speechcraft", "Sneak", "Alteration", "Divination"],
    minor: ["Short Blade", "Acrobatics", "Vitalism", "Enchanting", "Mercantile"]
  },
  "Witch": {
    attrs: { STR: 25, END: 40, AGI: 35, SPD: 30, INT: 65, WIL: 60, PER: 30, LCK: 40 },
    major: ["Alchemy", "Divination", "Alteration", "Vitalism", "Enchanting"],
    minor: ["Illusion", "Elementalism", "Sneak", "Speechcraft", "Security"]
  },
  "Alchemist": {
    attrs: { STR: 30, END: 40, AGI: 40, SPD: 35, INT: 70, WIL: 45, PER: 40, LCK: 55 },
    major: ["Alchemy", "Mercantile", "Short Blade", "Athletics", "Vitalism"],
    minor: ["Security", "Speechcraft", "Light Armor", "Enchanting", "Divination"]
  },
  "Enchanter": {
    attrs: { STR: 25, END: 35, AGI: 35, SPD: 30, INT: 70, WIL: 65, PER: 30, LCK: 40 },
    major: ["Enchanting", "Divination", "Alchemy", "Alteration", "Conjuration"],
    minor: ["Vitalism", "Elementalism", "Speechcraft", "Security", "Short Blade"]
  }
};

const ARCHETYPE_INFO = {
  "Knight": {
    lore: "When a Knight enters a room, the room gets smaller. Greatswords, war axes, two-handed hammers: these are their instruments, and the damage they deal is extraordinary. Every swing burns Fatigue, so Knights are at their best in short, decisive engagements. They falter in extended attrition fights and they are not subtle, but at full Fatigue with a greatsword in both hands, almost nothing hits harder.",
    bonus: "+5 to STR damage bonus calculations. Start with an Iron Greatsword and Iron Chainmail."
  },
  "Shield-Brother": {
    lore: "The Shield-Brother is the wall that holds. One weapon, one shield, and refusal to go down define this archetype. Block makes incoming damage unreliable, and Vitalism support keeps them standing. They trade raw burst damage for reliability over long dungeon pressure.",
    bonus: "+1 AR when using a shield. Start with an Iron Longsword, Iron Shield, and Iron Chainmail."
  },
  "Duelist": {
    lore: "Fast, precise, and dangerous at close range, the Duelist fights through speed rather than raw strength. Two-weapon pressure can overwhelm targets quickly. Agility drives offense and mobility, but durability is limited and mistakes are punished.",
    bonus: "Second attack has no penalty, and feats that reduce the penalty improve your second attack further. Start with two Iron Shortswords and Leather Armor."
  },
  "Ranger": {
    lore: "Rangers solve problems from distance. They scout ahead, read terrain, and remove threats before melee starts. Sneak and Athletics make them excellent pathfinders, and if cornered they can still fight with a short blade.",
    bonus: "Can fire a bow twice per turn a number of times each combat equal to level. Start with a Short Bow, 20 arrows, and Leather Armor."
  },
  "Crusader": {
    lore: "The Crusader combines heavy armor front-line pressure with practical Vitalism. They are not the highest damage dealer or strongest pure caster, but can sustain both steel and spell through one encounter and outlast opposition.",
    bonus: "Vitalism spells while in heavy armor cost 1 less MP (min 1). Start with an Iron Longsword, Iron Shield, Iron Chainmail, and two Apprentice Vitalism spells."
  },
  "Nightblade": {
    lore: "The Nightblade merges stealth and illusion with lethal close execution. They infiltrate, position, and strike from advantage, using magical setup to convert one opening into decisive damage.",
    bonus: "+1d6 damage from undetected position (once per combat unless re-hidden). Start with an Iron Dagger, Leather Armor, and two Apprentice Illusion spells."
  },
  "Rogue": {
    lore: "Rogues dominate non-combat problem-solving. They bypass locks, gather hidden information, and manipulate positions in and out of battle. Their toolkit is about options and access rather than brute force.",
    bonus: "Re-roll one failed Speechcraft or Security roll per short rest. Start with a Lockpick Set, Iron Dagger, Leather Armor, and 100 gold."
  },
  "Bard": {
    lore: "Bards are social specialists who weaponize conversation, performance, and reputation. They move fluidly through institutions and crowds, turning soft power into practical leverage for the party.",
    bonus: "May substitute Speechcraft for any PER-adjacent skill roll once per short rest. Start with a Simple Instrument, Iron Dagger, Traveler's Clothes, and two Apprentice Illusion spells."
  },
  "Spy": {
    lore: "Spies thrive on preparation, cover identity, and social infiltration. They pair Illusion with high-stakes Speechcraft and patient leverage-building to enter systems that force cannot crack.",
    bonus: "Once per short rest, create a convincing false identity; Speechcraft rolls to maintain it are Easy (-10). Start with a Disguise Kit, Iron Dagger, decent clothing, two Apprentice Illusion spells, and 100 gold."
  },
  "Fence": {
    lore: "A Fence is a broker first. They connect people, goods, jobs, and information at profitable intersections. Mercantile precision plus underworld access turns treasure into influence.",
    bonus: "Always knows approximate item value on sight and can appraise without a roll. Sell prices treated as if Mercantile were 20 higher; can sell stolen items to any normally compatible merchant. Start with Iron Dagger, Merchant Kit, 150 gold, and one named contact."
  },
  "Battle-Mage": {
    lore: "The Battle-Mage rejects arcane fragility by wearing armor and carrying steel. They alternate or combine martial and magical pressure, managing Fatigue and Magicka as dual resources.",
    bonus: "+1 MP recovered on short rest. Start with an Iron Longsword, Iron Chainmail, and three Apprentice Elementalism spells."
  },
  "Sorcerer": {
    lore: "At full Magicka, the Sorcerer is among the most destructive characters in the game. The trade-off is survivability: little armor, limited melee resilience, and strict positioning demands.",
    bonus: "+2 bonus MP. Elementalism spells cost 1 less MP (min 1). Start with an Ironwood Staff and three Apprentice spells."
  },
  "Priest": {
    lore: "Priests keep parties alive through sustained healing, recovery support, and controlled magical utility. Their value shows up in campaign endurance and crisis stabilization.",
    bonus: "Vitalism spells cost 1 less MP (min 1). Potions brewed by you that restore HP/MP/FP restore +2 HP. Start with an Ironwood Staff and three Apprentice Vitalism spells."
  },
  "Summoner": {
    lore: "Summoners fight through controlled entities and bound effects, converting Magicka into battlefield presence and protection. They are force multipliers that require planning and resource timing.",
    bonus: "May maintain one extra summon at a time. Summons last +1 minute. Start with four Apprentice/Journeyman Conjuration spells."
  },
  "Illusionist": {
    lore: "Illusionists win by preventing clean enemy action windows. They reshape awareness, positioning, and threat priority so fights end before direct attrition resolves.",
    bonus: "Illusion spells cost 1 less MP (min 1). Use Illusion in place of Sneak once per combat. Start with three Apprentice Illusion spells."
  },
  "Witch": {
    lore: "Witches pre-win encounters through preparation, brews, toxins, and tactical consumables. They are strongest when given planning time and can pivot between support and disruption.",
    bonus: "Brew one extra potion per long rest. Thrown alchemicals gain +1 magnitude. Start with an Alchemical Kit, Mortar and Pestle, Iron Dagger, and two Apprentice spells."
  },
  "Alchemist": {
    lore: "Alchemists are practical utility engines who convert ingredients into encounter solutions. They specialize in reliable preparation, identification, and adaptive item use.",
    bonus: "+1 property revealed when tasting an unknown ingredient. May identify any potion without a roll. Start with a basic Alchemical Kit (mortar and pestle), Iron Dagger, and 100 gold."
  },
  "Enchanter": {
    lore: "Enchanters build long-term party power through crafted magical equipment. Their impact scales over time as each member carries layered enhancements.",
    bonus: "When making constant-effect enchantments, ignore the magnitude penalty. Start with an Enchanting Toolkit, one filled Lesser Soul Gem, and 50 gold."
  }
};

const LINEAGES = {
  "Solarirum": {
    attrs: { INT: 10, WIL: 5, END: -5, STR: -5, SPD: -5 },
    baseMoveLand: 20,
    notes: "+10 to one chosen magic school.",
    skills: {},
    choices: [{ id: "solMagic", count: 1, amount: 10, options: MAGIC_SCHOOLS }]
  },
  "Sylvarirum": {
    attrs: { AGI: 10, SPD: 5, STR: -10, END: -5 },
    baseMoveLand: 25,
    notes: "+10 Marksman, +5 Sneak.",
    skills: { "Marksman": 10, "Sneak": 5 }
  },
  "Vethanirum": {
    attrs: { INT: 5, WIL: 5, PER: 5, STR: -5, END: -5, AGI: -5 },
    baseMoveLand: 20,
    notes: "+5 to all magic schools.",
    skills: Object.fromEntries(MAGIC_SCHOOLS.map((s) => [s, 5]))
  },
  "Ashirum": {
    attrs: { INT: 5, AGI: 5, SPD: 5, END: -5, PER: -5, LCK: -5 },
    baseMoveLand: 25,
    notes: "+10 to one magic school, +5 Long Blade or Short Blade.",
    skills: {},
    choices: [
      { id: "ashMagic", count: 1, amount: 10, options: MAGIC_SCHOOLS },
      { id: "ashBlade", count: 1, amount: 5, options: ["Long Blade", "Short Blade"] }
    ]
  },
  "Apisdrenn": {
    attrs: { END: 10, STR: 5, SPD: -5, AGI: -5, PER: -5 },
    baseMoveLand: 15,
    notes: "+10 Heavy Armor, +10 Blunt Weapon or Axe.",
    skills: { "Heavy Armor": 10 },
    choices: [{ id: "apisdrennWeapon", count: 1, amount: 10, options: ["Blunt Weapon", "Axe"] }]
  },
  "Apiskeld": {
    attrs: { END: 5, STR: 5, INT: 5, SPD: -5, AGI: -5, PER: -5 },
    baseMoveLand: 15,
    notes: "+10 Enchanting, +5 Blunt Weapon, +5 Heavy Armor.",
    skills: { "Enchanting": 10, "Blunt Weapon": 5, "Heavy Armor": 5 }
  },
  "Apisveldir": {
    attrs: { INT: 5, PER: 5, LCK: 5, STR: -5, END: -5, AGI: -5 },
    baseMoveLand: 15,
    notes: "+10 Mercantile, +10 Enchanting, +5 Security.",
    skills: { "Mercantile": 10, "Enchanting": 10, "Security": 5 }
  },
  "Kreln": {
    attrs: { END: 10, STR: 5, SPD: -5, PER: -5, LCK: -5 },
    baseMoveLand: 15,
    baseMoveWater: 30,
    notes: "+10 Athletics, +5 Heavy Armor or Blunt Weapon.",
    skills: { "Athletics": 10 },
    choices: [{ id: "krelnCombat", count: 1, amount: 5, options: ["Heavy Armor", "Blunt Weapon"] }]
  },
  "Imperials": {
    attrs: { PER: 5, END: 5, LCK: 5, INT: -5, AGI: -5, WIL: -5 },
    baseMoveLand: 20,
    notes: "+10 Speechcraft, +5 Mercantile.",
    skills: { "Speechcraft": 10, "Mercantile": 5 }
  },
  "Nordal": {
    attrs: { STR: 10, END: 5, INT: -5, WIL: -5, PER: -5 },
    baseMoveLand: 20,
    notes: "+10 Blunt Weapon or Long Blade. Magic schools have a floor of 5.",
    skills: {},
    choices: [{ id: "nordalWeapon", count: 1, amount: 10, options: ["Blunt Weapon", "Long Blade"] }],
    schoolFloor: 5
  },
  "Sunblade": {
    attrs: { STR: 10, AGI: 5, INT: -5, WIL: -5, LCK: -5 },
    baseMoveLand: 20,
    notes: "+10 Long Blade, +5 Block.",
    skills: { "Long Blade": 10, "Block": 5 }
  },
  "Ashveld": {
    attrs: { END: 5, AGI: 5, LCK: 5, INT: -5, WIL: -5, PER: -5 },
    baseMoveLand: 20,
    notes: "+10 Athletics, +5 to Alchemy/Armorer/Security.",
    skills: { "Athletics": 10 },
    choices: [{ id: "ashveldSkill", count: 1, amount: 5, options: ["Alchemy", "Armorer", "Security"] }]
  },
  "Stoneguard": {
    attrs: { STR: 10, END: 5, PER: -5, LCK: -5, SPD: -5 },
    baseMoveLand: 20,
    notes: "+10 Blunt Weapon or Axe, +5 Heavy Armor.",
    skills: { "Heavy Armor": 5 },
    choices: [{ id: "stoneguardWeapon", count: 1, amount: 10, options: ["Blunt Weapon", "Axe"] }]
  },
  "Gorirum": {
    attrs: { STR: 5, INT: 5, WIL: 5, AGI: -5, PER: -5, LCK: -5 },
    baseMoveLand: 20,
    notes: "+10 Long Blade, +5 to two magic schools.",
    skills: { "Long Blade": 10 },
    choices: [{ id: "gorirumMagic", count: 2, amount: 5, options: MAGIC_SCHOOLS }]
  },
  "Veildrift": {
    attrs: { WIL: 10, INT: 5, STR: -5, END: -5, PER: -5 },
    baseMoveLand: 20,
    notes: "+10 Divination, +5 Sneak.",
    skills: { "Divination": 10, "Sneak": 5 }
  },
  "Murrak": {
    attrs: { WIL: 5, END: 5, INT: -10, PER: -5 },
    baseMoveLand: 20,
    notes: "+10 Elementalism or Illusion, +5 Enchanting.",
    skills: { "Enchanting": 5 },
    choices: [{ id: "murrakMagic", count: 1, amount: 10, options: ["Elementalism", "Illusion"] }]
  },
  "Bovari": {
    attrs: { STR: 10, END: 5, AGI: -5, SPD: -5, INT: -5 },
    baseMoveLand: 20,
    notes: "+10 Athletics, +5 to any two non-combat skills.",
    skills: { "Athletics": 10 },
    choices: [{ id: "bovariNonCombat", count: 2, amount: 5, options: NON_COMBAT_SKILLS }]
  },
  "Naukin": {
    attrs: { AGI: 10, SPD: 5, STR: -5, END: -5, PER: -5 },
    baseMoveLand: 25,
    notes: "+10 Sneak, +5 Security.",
    skills: { "Sneak": 10, "Security": 5 }
  },
  "Arantza": {
    attrs: { AGI: 5, SPD: 5, STR: 5, INT: -5, WIL: -5, PER: -5 },
    baseMoveLand: 20,
    notes: "+10 Athletics (climbing), +5 Sneak.",
    skills: { "Athletics": 10, "Sneak": 5 }
  },
  "Verdathi": {
    attrs: { END: 5, AGI: 5, INT: 5, STR: -5, PER: -5, LCK: -5 },
    baseMoveLand: 15,
    baseMoveWater: 35,
    notes: "+10 Athletics, +5 Security.",
    skills: { "Athletics": 10, "Security": 5 }
  }
};

const LINEAGE_LORE = {
  "Solarirum": "The Solarirum trace their lineage to the oldest elven civilization, a culture of scholar-casters that shaped the continent's earliest institutions. Tall, angular, and faintly luminescent in direct sunlight, most live in layered city-states where magical study is as ordinary as farming is elsewhere. They regard themselves as custodians of knowledge - a belief their neighbors find either admirable or insufferable, depending on how recently they've had to deal with one.",
  "Sylvarirum": "Sylvarirum communities nestle in ancient forests in treehouse settlements invisible to the uninvited. Smaller-framed than most races but extraordinarily quick, they are at home in natural terrain that slows everyone else. Many spend years on solitary journeys - called the Wandering - before returning to their communities, treating it as both a coming-of-age and a spiritual discipline.",
  "Vethanirum": "The Vethanirum emerged generations ago at the cultural fringes of elven culture and today form their own distinct people. They carry natural attunement to magic without Solarirum-level immersion, and a practicality that comes from navigating between worlds their whole lives. Most describe themselves simply as practical - which is the polite word for someone who has learned not to take anyone's traditions too seriously, including their own.",
  "Ashirum": "The Ashirum have lived for centuries around active volcanic regions, their culture shaped by constant fire and geological instability. Their dark complexions are marked by subtle ember-coloured eyes and faint natural patterns on the skin. Ashirum society emphasises resilience, self-sufficiency, and the understanding that comfort is temporary but adaptation is permanent.",
  "Apisdrenn": "The Apisdrenn are the most widely encountered dwarven people - character-builders, miners, and smiths who maintain a vast network of mountain strongholds and underground trade routes. Stocky even by dwarven standards, with a well-earned reputation for stubbornness and craftsmanship that they consider deeply accurate and not remotely an insult. Their ales are the best in the known world, which they will tell you unprompted.",
  "Apiskeld": "The Apiskeld emerge from deeper and older holds than their Apisdrenn kin. Their connection to heat and geological pressure runs almost spiritual - their skin carries a faint metallic sheen in firelight, and many Apiskeld describe the sound of a working forge as something close to music. Apiskeld smiths and enchanters are regarded as among the finest practitioners in the known world, and they charge accordingly.",
  "Apisveldir": "The Apisveldir are the rarest and most widely misunderstood of the dwarven peoples. To outsiders their fixation on rare gemstones looks like greed - they will divert an entire expedition to investigate a glimmer in a far tunnel, spend a month's wages on a single flawless sapphire, and turn down gold in favour of a fragment of something rarer. To the Apisveldir themselves, this is not acquisitiveness. It is closer to recognition. Apisveldir believe that exceptional gemstones are not merely beautiful - they are the physical memory of geological time, compressed emotion, and in some cases echoes of souls too ancient to be contained by mortal vessels. Their theology holds that certain gems are listening. Most non-Apisveldir find this unsettling. The Apisveldir consider that a limitation of imagination.",
  "Kreln": "The Kreln are the remnants of a dwarven civilization that, long before recorded history, retreated entirely into the deep ocean. No one knows whether it was catastrophe, choice, or something stranger that drove them below the surface. What remained emerged over millennia as something distinctly its own: stocky and dense like their landbound cousins, but shaped by crushing pressure and lightless depths into a form that unsettles those encountering them for the first time. Kreln bodies are compact and low-slung, built to withstand forces that would rupture other creatures. Their skin ranges from deep blue-grey to mottled greenish-black, with faint bioluminescent patches along the jaw, collarbones, and the backs of the hands - dim, cool light that pulses slowly when they are calm and brightens under stress. Many have partial carapace growth: ridged, calcified plates of bone-like material along the shoulders, shins, and the crown of the skull, their edges irregular and barnacle-roughed. Their eyes are enormous and pale, adapted for deep water - on the surface, many squint against bright light and wear smoked glass lenses carved from obsidian. The Kreln do not have a unified civilization above water. Small enclaves settle in coastal caves, flooded ruins, and port-city underbellies. Most who travel the wider world do so because their settlement was destroyed, because they were exiled, or because they are searching for something their people lost long ago.",
  "Imperials": "Imperials are the most numerous people in the lowland cities and trade routes. Their civilization is organized, mercantile, and built on the conviction that good administration produces better outcomes than raw power. They produce diplomats, merchants, soldiers, and bureaucrats in equal measure, and their language and coinage have become the continental standard through quiet, persistent usefulness rather than conquest.",
  "Nordal": "The Nordal come from the northern reaches - tundra, glacier-carved fjords, and seas that freeze in winter. Large, hardy, shaped by a culture that prizes strength, directness, and communal endurance. Most Nordal magic users are unusual among their own people, though not unwelcome; the north has its own traditions of rune-working and storm-calling that most southerners do not recognize as the same discipline.",
  "Sunblade": "The Sunblade come from a culture that treats swordsmanship as one of the highest arts. Their history is one of migration, resistance, and the cultivation of martial excellence as both survival tool and cultural identity. Sunblade tradition often leads individuals to travel far from their homelands - some as merchants, some as mercenaries, some as scholars. Not until they have learned something valuable they see as valuable to their family are they culturally allowed to return home.",
  "Ashveld": "The Ashveld are a human lineage from the volcanic highlands at the continent's interior, where the earth is young and the air tastes of sulfur. They are not defined by fire magic - a stereotype that irritates them - but by the practical, unsentimental culture that emerges from living where the ground occasionally kills you. The Ashveld are adaptable, direct, and deeply pragmatic, with a cultural tradition of improvised problem-solving that makes them valued in diverse expeditions. Physically, they tend toward lean builds with weathered, ash-darkened complexions ranging from warm brown to deep bronze. Their hair is strikingly white and smooth, but usually darkens with age, and men go bald fairly early in life. Their eyes often carry a reddish-amber tint attributed in local folklore to generations of staring into forge-light.",
  "Stoneguard": "Stoneguard culture is organized around the war-band, the smith, and the concept of earned authority. They are direct, pragmatic, and deeply invested in the idea that capability matters more than birth. Their settlements are fortified and self-sufficient - built for war not because they seek it, but because they have learned to expect it. Stoneguard who leave their holdings often do so as mercenaries, wanderers, or individuals who could not abide the direction their war-band was heading.",
  "Gorirum": "The Gorirum insist - and their oldest scholars can produce genealogical records that are at minimum inconclusive - that their people and the elven peoples share a common ancestor, diverged in some ancient age before written history. The suffix -irum in their formal name is not accidental. Neither are the faintly longer ears, the slightly higher natural aptitude for magic, and the longer-than-average lifespan they carry compared to other orcish lineages. Most elves dismiss this claim with varying degrees of condescension. A few Solarirum scholars find it quietly disquieting. Some Vethanirum, whose own lineage formed at a cultural boundary, are privately interested. The Gorirum do not press the point - they simply live with the records and let others draw conclusions.",
  "Veildrift": "No one knows where the Veildrift came from. The oldest records describe them appearing at the edges of battlefields, in the ruins of collapsed towers, and at sites where large amounts of magic were spent in catastrophic ways. Current scholars debate whether they are the descendants of people who survived a planar boundary event, or something stranger still. The Veildrift themselves rarely discuss it, either because they do not know or because they have decided it does not matter. Veildrift are profoundly unsettling in appearance. Their skin is so pale as to be nearly translucent - in dim light, the faint shadows of veins and underlying structure are visible beneath the surface, giving them a ghostly, half-present quality. Their hair is white or silver without exception, and their eyes are a uniform pale blue or silver-grey with no visible pupil. Despite their fragile appearance, they move with unusual precision, and their strange partial-presence makes them naturally difficult to perceive in low light.",
  "Murrak": "The Murrak are a people of disputed origin. Some scholars claim they are the surviving descendants of a civilization that bargained poorly with something ancient. Others suggest they are simply a human lineage that diverged under extreme magical saturation. The Murrak themselves do not spend much time on the question: they are here, they are capable, and the world's opinion of their origins is their own problem. Murrak have dull grey skin with a slightly matte texture, as though the color was pressed out of them. Their eyes are dim purple - not vivid or striking, but a flat, faded violet that unnerves people who look too long. They tend to be stocky and plain-featured. What they lack in raw intellectual processing they compensate for with an instinctive resonance with magical force: Murrak spellcasters often outperform their academic credentials, drawing on something in their blood that instruction alone does not explain.",
  "Bovari": "The Bovari are a large and immediately distinctive people: broadly built at the shoulder, standing just under six feet in most cases, with the squared heads and prominent curved horns of bovine ancestry. Both males and females bear horns, and Bovari culture attaches enormous personal significance to them - horns are cultivated, carved, painted, and adorned across a lifetime, and their condition and decoration communicate more about a Bovari's personal history than any word of introduction. The most immediately unusual feature of Bovari anatomy is their arms. Each arm bifurcates at the elbow, branching into two forearms and hands. A Bovari at rest typically holds two of their four hands at their sides and keeps the other two available for tasks; in conversation, all four are often in motion. This gives them a social expressiveness that other peoples can find overwhelming, and a practical capability that makes them sought-after as craftspeople, character-builders, and cooks. Bovari live in nomadic family groups or integrate comfortably into larger settlements, and they are generally regarded as among the most good-natured peoples in Aethermoor - a reputation they accept without particular pride.",
  "Naukin": "The Naukin are ratfolk - lean, quick, whisker-faced, and collectively the product of centuries of exploitation at the hands of mage-scholars who used them as subjects, test cases, servants, and occasionally ingredients. Their escape from the great wizard academies is a matter of historical record; how they organized it is not, because the Naukin have never discussed it with outsiders. Naukin colonies exist in the cracks of the world: old sewer networks beneath cities, collapsed buildings in the scholars' districts they once served, tunnels beneath mage towers. They are neither friendly nor hostile to the outside world by default - they are cautious in the extreme. A Naukin encountered alone has almost certainly been sent out deliberately, and a Naukin settlement does not welcome unannounced visitors. Individual Naukin who travel the wider world do so against cultural pressure, driven by necessity, exile, or a curiosity their people regard with suspicion. Naukin as a group are deeply, institutionally opposed to magic. This is not superstition - it is experiential. Most know exactly what was done to their ancestors with spells and enchantments. Naukin characters who practice magic are extraordinarily rare and face significant social consequences within their communities.",
  "Arantza": "The Arantza are bipedal spider-folk - primitive in the sense that their culture is oral, decentralized, and largely pre-agricultural, not in the sense of being simple. They are older than most of the cultures that would call them primitive, and their memory of the world's early shape is carried in stories that scholars have been trying to transcribe for a hundred years with limited success. Arantza anatomy is immediately arresting. They have three pairs of arms: two pairs in the normal humanoid configuration with hands at the ends, and one pair that juts from just below the shoulder blades, ending not in hands but in tapered chitinous points used for climbing and combat. Their faces have eight eyes arranged in two vertical rows along the sides of the skull - the upper four larger, the lower four smaller - with a wide, angular mouth positioned at roughly mid-face. Their skin is covered in fine dark bristle-hairs and their coloration varies from near-black to dark amber to a grey-brown that makes them nearly invisible in shadow.",
  "Verdathi": "The Verdathi are a reptilian people from the vast marshland territories of the southern coast. Reliable in ways that are hard to fake: the swamp does not forgive pretense. On land, Verdathi are capable - solid, if slightly slower than average. In water, they are something else entirely. A Verdathi in their element is faster than almost anything that did not evolve there, and the water offers capabilities that land-dwellers simply cannot counter."
};

const LINEAGE_ABILITIES = {
  "Solarirum": [
    "Elemental Sensitivity: take 25% extra fire/frost/shock damage, but deal 25% more fire/frost/shock spell damage."
  ],
  "Sylvarirum": [
    "Forest-Born: ignore natural difficult terrain penalties; tracking and wilderness survival checks are Easy (-10 to roll)."
  ],
  "Vethanirum": [
    "Attuned: 25% magic resistance (incoming spell damage reduced by 25%)."
  ],
  "Ashirum": [
    "Forge-Born: 50% fire resistance."
  ],
  "Apisdrenn": [
    "Stone Blood: reduce incoming physical damage by 1 after AR."
  ],
  "Apiskeld": [
    "Heat-Forged: 50% fire resistance.",
    "Once per long rest, empower one metal weapon or armor for next combat (+1 damage or +1 AR, no stacking)."
  ],
  "Apisveldir": [
    "Stone Memory (passive): reading gems reveals approximate age, origin region, and soul-binding history.",
    "Gem Resonance (active): once per long rest consume a filled soul gem to restore MP (Petty 2, Lesser 4, Common 6, Greater 8, Grand 12)."
  ],
  "Kreln": [
    "Pressure-Born: reduce incoming physical damage by 1 after AR.",
    "Ignore underwater movement penalties; in darkness emit dim bioluminescent light (2m radius)."
  ],
  "Imperials": [
    "Voice of Command: once per combat, one hostile humanoid within 10m makes WIL check vs 40 or pauses for 1 round."
  ],
  "Nordal": [
    "Battle Shout: once per combat, enemies within 10m make WIL check vs 40 or are Frightened for 1 round."
  ],
  "Sunblade": [
    "Adrenaline: once per combat as a free action, regain 1d6+1 FP (usable while Staggered)."
  ],
  "Ashveld": [
    "Hardy Adaptation: natural environmental hazards cost no extra FP and are resisted with advantage."
  ],
  "Stoneguard": [
    "Berserker: once per combat rage for 3 rounds (+5 STR damage bonus, immune to Frightened/Staggered), then lose 1d6 FP."
  ],
  "Gorirum": [
    "Ancient Resonance: once per long rest add STR damage bonus to spell damage.",
    "Casting two ranks below minimum skill uses +10 penalty instead of +40."
  ],
  "Veildrift": [
    "Veil-Step: once per short rest become briefly incorporeal; physical attacks have 25% miss chance until end of next turn.",
    "Natural fear resistance: Frightened requires two failed rolls to apply."
  ],
  "Murrak": [
    "Bloodspell: once per combat cast a known spell by spending HP instead of MP.",
    "When damaged by magic, recover 1 MP."
  ],
  "Bovari": [
    "Four-Handed: may perform two minor item/mechanism interactions in place of one.",
    "Once per combat, one bonus light-weapon attack without FP cost (separate from Dual Strike)."
  ],
  "Naukin": [
    "Spell-Scarred: must WIL-save to accept beneficial magic from others.",
    "Advantage resisting harmful magic; once per combat may attempt to mute a spell targeting you with AGI roll."
  ],
  "Arantza": [
    "Spur Strike: once per round bonus-action back-spur attack (Short Blade, 1d4 piercing, no FP).",
    "Advantage on non-magical perception checks from wide visual field."
  ],
  "Verdathi": [
    "Aquatic Dominance: while in water, your attacks/skill checks are at advantage and attacks from outside water are at disadvantage.",
    "Disease Resistance: near-immune to disease; Marsh Fever immunity."
  ]
};

const BIRTHSIGNS = {
  "The Ironstar": {
    notes: "Once per combat reduce a massive hit by 1d10.",
    skills: { "Block": 5, "Heavy Armor": 5 }
  },
  "The Wandering Eye": {
    notes: "+1 Luck Bonus and one d100 re-roll per long rest; -5 concentration checks.",
    skills: { "Sneak": 5, "Mercantile": 5 },
    luckBonusFlat: 1
  },
  "The Scholar's Lantern": {
    notes: "+10 INT (cap 75) and improved Misc advancement.",
    attrs: { INT: 10 },
    choices: [{ id: "scholarMagic", count: 2, amount: 5, options: MAGIC_SCHOOLS }]
  },
  "The Thornwarden": {
    notes: "+10 END (cap 75) and harder to drop.",
    attrs: { END: 10 }
  },
  "The Silver Tongue": {
    notes: "+10 PER (cap 75), +5 NPC disposition.",
    attrs: { PER: 10 },
    skills: { "Speechcraft": 10, "Mercantile": 5 }
  },
  "The Ashen Crown": {
    notes: "Stabilizing allies restores extra HP.",
    attrs: { END: 5 },
    skills: { "Vitalism": 10 }
  },
  "The Pale Archer": {
    notes: "Crit threshold improves and ranged ignores 2 AR.",
    skills: { "Marksman": 10 }
  },
  "The Hearthfire": {
    notes: "Improved FP recovery and support pulse.",
    skills: { "Athletics": 5, "Vitalism": 5 }
  },
  "The Voidwalker": {
    notes: "+10 WIL (cap 75), improved spell absorption.",
    attrs: { WIL: 10 },
    skills: { "Divination": 5, "Conjuration": 5 }
  },
  "The Crimson Hart": {
    notes: "Once per combat Burning Strike.",
    choices: [{ id: "hartAttr", count: 1, amount: 10, options: ["STR", "AGI"], type: "attribute" }]
  },
  "The Steadfast Wheel": {
    notes: "Better sell prices and true appraisal.",
    skills: { "Mercantile": 10, "Speechcraft": 5 }
  },
  "The Thornweave": {
    notes: "Alchemy/Enchanting at advantage.",
    choices: [{ id: "thornweaveSkill", count: 1, amount: 10, options: ["Enchanting", "Alchemy"] }],
    dynamicPair: true
  },
  "The Empty Throne": {
    notes: "Command aura and extra speech-adjacent use.",
    attrs: { PER: 10 },
    skills: { "Speechcraft": 5 }
  }
};

const BIRTHSIGN_LORE = {
  "The Ironstar": "The Ironstar rises in late autumn, a compact cluster that ancient sailors called the Shield-Fist. Those born under it are said to have iron in their blood and conflict in their nature - not cruelty, but an attunement to struggle.",
  "The Wandering Eye": "A lone star that drifts visibly against the fixed firmament across a lifetime - an optical illusion, astronomers now say, though mystics disagree. Those born under it are restless, perceptive, and rarely where you expect them to be.",
  "The Scholar's Lantern": "A dim, steady constellation that burns throughout the year. Scholars claim it never sets - it simply becomes invisible against the dawn. Those born under it learn faster, reason more clearly, and remember things they were never taught.",
  "The Thornwarden": "A sprawling constellation in the shape of a thorned branch, visible only in deep winter. Those born under it are difficult to kill - not through any visible toughness, but through a stubborn persistence that outlasts situations that should have finished them.",
  "The Silver Tongue": "A crescent-shaped constellation associated in folklore with honeybees, silver coins, and broken promises. Those born under it find words come easily - almost suspiciously so.",
  "The Ashen Crown": "A constellation that appears only after major catastrophes, according to myth - though it rises every year regardless of what happens below. Those born under it are marked by something - a resilience born from having already survived something terrible, or perhaps the expectation that they will.",
  "The Pale Archer": "A long, thin constellation oriented like a drawn bow. Those born under it have an unnerving capacity for patience - they wait, they watch, and when they act, they rarely miss.",
  "The Hearthfire": "A bright, comfortable constellation associated with hospitality, cooking fires, and the warmth of company. Those born under it recover faster, sustain more effort, and tend to bring out the best in those around them.",
  "The Voidwalker": "A star pattern that is defined by what is not there - a rough ring of dim stars around a patch of empty sky. Mystics argue about what it represents. Those born under it are comfortable in the dark, in empty places, and with things that have no name.",
  "The Crimson Hart": "A red-tinged constellation shaped, to some eyes, like a leaping deer. Those born under it burn with something - conviction, fury, love, obsession. It does not matter which.",
  "The Steadfast Wheel": "A circular constellation associated with mills, turning seasons, and the movement of goods. Those born under it understand value - what things cost, what they are worth, and what the difference between those two numbers can buy.",
  "The Thornweave": "A dense, intricate constellation that rewards patient observation - the more you look, the more patterns emerge. Those born under it are makers: they understand structure, they build things that last, and they leave marks on the world.",
  "The Empty Throne": "A large, prominent constellation shaped like a high-backed chair with no one in it. Those born under it are noticed. They are listened to. Whether that is a gift or a burden depends entirely on what they say."
};

const state = {
  buildMode: "custom",
  archetype: "Knight",
  lineage: "Solarirum",
  birthsign: "The Ironstar",
  customAttrSpend: buildEmptyAttributeSpend(),
  majorSelected: [],
  minorSelected: [],
  majorPoints: 5,
  minorPoints: 5,
  miscPoints: 5,
  majorAlloc: {},
  minorAlloc: {},
  miscAlloc: {},
  lineageChoiceValues: {},
  birthsignChoiceValues: {},
  selectedSpells: [
    { school: "", spell: "" },
    { school: "", spell: "" }
  ],
  selectedEquipment: {
    weapon: "",
    armor: "",
    shield: "No Shield",
    kit: ""
  },
  characterName: "",
  background: ""
};

const ui = {};

document.addEventListener("DOMContentLoaded", function () {
  loadElements();
  fillMainSelects();
  restoreFromStorage();
  bindEvents();
  renderPage();
});

function buildEmptyAttributeSpend() {
  const result = {};
  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    result[ATTRIBUTES[i]] = 0;
  }
  return result;
}

function loadElements() {
  ui.buildModeCards = document.getElementById("buildModeCards");
  ui.archetypeSection = document.getElementById("archetypeSection");
  ui.archetypeInfo = document.getElementById("archetypeInfo");
  ui.archetypeSelect = document.getElementById("archetypeSelect");
  ui.lineageSelect = document.getElementById("lineageSelect");
  ui.birthsignSelect = document.getElementById("birthsignSelect");
  ui.lineageNotes = document.getElementById("lineageNotes");
  ui.birthsignNotes = document.getElementById("birthsignNotes");
  ui.lineageOptions = document.getElementById("lineageOptions");
  ui.lineageInfo = document.getElementById("lineageInfo");
  ui.birthsignOptions = document.getElementById("birthsignOptions");
  ui.birthsignInfo = document.getElementById("birthsignInfo");
  ui.attributeGuide = document.getElementById("attributeGuide");
  ui.attributePool = document.getElementById("attributePool");
  ui.attributeGrid = document.getElementById("attributeGrid");
  ui.majorPoints = document.getElementById("majorPoints");
  ui.minorPoints = document.getElementById("minorPoints");
  ui.miscPoints = document.getElementById("miscPoints");
  ui.majorSkillPicker = document.getElementById("majorSkillPicker");
  ui.minorSkillPicker = document.getElementById("minorSkillPicker");
  ui.skillTableWrap = document.getElementById("skillTableWrap");
  ui.derivedStatsGrid = document.getElementById("derivedStatsGrid");
  ui.equipmentGuide = document.getElementById("equipmentGuide");
  ui.weaponSelect = document.getElementById("weaponSelect");
  ui.weaponInfo = document.getElementById("weaponInfo");
  ui.armorSelect = document.getElementById("armorSelect");
  ui.armorInfo = document.getElementById("armorInfo");
  ui.shieldSelect = document.getElementById("shieldSelect");
  ui.shieldInfo = document.getElementById("shieldInfo");
  ui.kitSelect = document.getElementById("kitSelect");
  ui.kitInfo = document.getElementById("kitInfo");
  ui.spellGuide = document.getElementById("spellGuide");
  ui.spellOneSchool = document.getElementById("spellOneSchool");
  ui.spellTwoSchool = document.getElementById("spellTwoSchool");
  ui.spellOneName = document.getElementById("spellOneName");
  ui.spellTwoName = document.getElementById("spellTwoName");
  ui.spellOneInfo = document.getElementById("spellOneInfo");
  ui.spellTwoInfo = document.getElementById("spellTwoInfo");
  ui.characterName = document.getElementById("characterName");
  ui.background = document.getElementById("background");
  ui.exportCharacterBtn = document.getElementById("exportCharacterBtn");
  ui.openFinalSheetBtn = document.getElementById("openFinalSheetBtn");
  ui.exportJsonPreview = document.getElementById("exportJsonPreview");
  ui.saveCharacterBtn = document.getElementById("saveCharacterBtn");
}

function fillMainSelects() {
  fillSelectFromList(ui.archetypeSelect, Object.keys(ARCHETYPES));
  fillSelectFromList(ui.lineageSelect, Object.keys(LINEAGES));
  fillSelectFromList(ui.birthsignSelect, Object.keys(BIRTHSIGNS));
}

function fillSelectFromList(selectEl, list) {
  selectEl.innerHTML = "";
  for (let i = 0; i < list.length; i += 1) {
    const option = document.createElement("option");
    option.value = list[i];
    option.textContent = list[i];
    selectEl.appendChild(option);
  }
}

function bindEvents() {
  const modeRadios = document.querySelectorAll('input[name="buildMode"]');
  modeRadios.forEach(function (radio) {
    radio.addEventListener("change", function (event) {
      state.buildMode = event.target.value;
      resetSkillPointPools();
      renderPage();
    });
  });

  ui.archetypeSelect.addEventListener("change", function () {
    state.archetype = ui.archetypeSelect.value;
    resetSkillPointPools();
    renderPage();
  });

  ui.lineageSelect.addEventListener("change", function () {
    state.lineage = ui.lineageSelect.value;
    state.lineageChoiceValues = {};
    renderPage();
  });

  ui.birthsignSelect.addEventListener("change", function () {
    state.birthsign = ui.birthsignSelect.value;
    state.birthsignChoiceValues = {};
    renderPage();
  });

  ui.weaponSelect.addEventListener("change", function () {
    state.selectedEquipment.weapon = ui.weaponSelect.value;
    renderEquipment();
  });

  ui.armorSelect.addEventListener("change", function () {
    state.selectedEquipment.armor = ui.armorSelect.value;
    renderEquipment();
  });

  ui.shieldSelect.addEventListener("change", function () {
    state.selectedEquipment.shield = ui.shieldSelect.value;
    renderEquipment();
  });

  ui.kitSelect.addEventListener("change", function () {
    state.selectedEquipment.kit = ui.kitSelect.value;
    renderEquipment();
  });

  bindSpellRowEvents(0, ui.spellOneSchool, ui.spellOneName);
  bindSpellRowEvents(1, ui.spellTwoSchool, ui.spellTwoName);

  ui.characterName.addEventListener("input", function () {
    state.characterName = ui.characterName.value;
  });

  ui.background.addEventListener("input", function () {
    state.background = ui.background.value;
  });

  ui.exportCharacterBtn.addEventListener("click", function () {
    const character = buildCharacterSheet();
    ui.exportJsonPreview.textContent = JSON.stringify(character, null, 2);
  });

  ui.saveCharacterBtn.addEventListener("click", function () {
    persistToStorage();
    ui.saveCharacterBtn.textContent = "Saved";
    setTimeout(function () {
      ui.saveCharacterBtn.textContent = "Save Character";
    }, 1200);
  });

  ui.openFinalSheetBtn.addEventListener("click", function () {
    const character = buildCharacterSheet();
    localStorage.setItem("scrolls_steel_final_sheet", JSON.stringify(character));
    persistToStorage();
    window.location.href = "scrolls_and_steel_sheet.html";
  });
}

function bindSpellRowEvents(index, schoolSelect, spellSelect) {
  schoolSelect.addEventListener("change", function () {
    state.selectedSpells[index].school = schoolSelect.value;
    state.selectedSpells[index].spell = "";
    renderSpells();
  });

  spellSelect.addEventListener("change", function () {
    state.selectedSpells[index].spell = spellSelect.value;
    const otherIndex = index === 0 ? 1 : 0;
    if (
      state.selectedSpells[index].spell !== "" &&
      state.selectedSpells[index].spell === state.selectedSpells[otherIndex].spell
    ) {
      state.selectedSpells[index].spell = "";
    }
    renderSpells();
  });
}

function resetSkillPointPools() {
  state.majorAlloc = {};
  state.minorAlloc = {};
  state.miscAlloc = {};
  state.majorPoints = 5;
  state.minorPoints = 5;
  state.miscPoints = 5;
}

function renderPage() {
  updateCommonFields();
  renderArchetypeInfo();
  renderLineageSection();
  renderBirthsignSection();
  renderAttributes();
  renderSkillPickers();
  renderSkillTables();
  renderDerived();
  renderEquipment();
  renderSpells();
}

function updateCommonFields() {
  const cards = document.querySelectorAll(".build-mode-card");
  cards.forEach(function (card) {
    card.classList.toggle("active", card.dataset.mode === state.buildMode);
  });

  ui.archetypeSection.classList.toggle("hidden", state.buildMode !== "archetype");
  ui.archetypeSelect.value = state.archetype;
  ui.lineageSelect.value = state.lineage;
  ui.birthsignSelect.value = state.birthsign;
  ui.characterName.value = state.characterName;
  ui.background.value = state.background;

  const radios = document.querySelectorAll('input[name="buildMode"]');
  radios.forEach(function (radio) {
    radio.checked = radio.value === state.buildMode;
  });
}

function renderArchetypeInfo() {
  if (state.buildMode !== "archetype") {
    ui.archetypeInfo.innerHTML = "";
    return;
  }

  const archetype = ARCHETYPES[state.archetype];
  const info = ARCHETYPE_INFO[state.archetype] || {};
  const attrParts = [];
  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    const attr = ATTRIBUTES[i];
    attrParts.push(attr + " " + archetype.attrs[attr]);
  }

  ui.archetypeInfo.innerHTML = ""
    + "<h3>" + state.archetype + "</h3>"
    + "<p>" + (info.lore || "No lore found.") + "</p>"
    + "<p><strong>Starting Attributes</strong></p>"
    + "<p>" + attrParts.join("  ") + "</p>"
    + "<p><strong>Archetype Adjustment</strong></p>"
    + "<p>" + (info.bonus || "No archetype adjustment found.") + "</p>";
}

function renderLineageSection() {
  const lineage = LINEAGES[state.lineage];
  ui.lineageNotes.textContent = lineage.notes || "";
  renderChoiceControls(ui.lineageOptions, lineage.choices || [], state.lineageChoiceValues, "lineage");
  renderLineageDetails();
}

function renderLineageDetails() {
  const key = state.lineage;
  const lineage = LINEAGES[key];
  const lore = LINEAGE_LORE[key] || "Lore text not available.";
  const abilities = LINEAGE_ABILITIES[key] || [];

  const attrParts = formatMapAsBonusList(lineage.attrs || {});
  const skillParts = formatMapAsBonusList(lineage.skills || {});

  let movement = "";
  if (lineage.baseMoveWater) {
    movement = "Land " + lineage.baseMoveLand + "m, Water " + lineage.baseMoveWater + "m";
  } else {
    movement = lineage.baseMoveLand + "m baseline land movement";
  }

  let html = "";
  html += "<h3>" + key + "</h3>";
  html += "<p>" + lore + "</p>";
  html += "<p><strong>Abilities</strong></p>";
  html += "<ul>" + listToHtml(abilities, "None") + "</ul>";
  html += "<p><strong>Modifiers</strong></p>";
  html += "<ul>";
  html += "<li>Attribute Modifiers: " + (attrParts.length ? attrParts.join(", ") : "None") + "</li>";
  html += "<li>Skill Modifiers: " + (skillParts.length ? skillParts.join(", ") : "None") + "</li>";
  const choices = lineage.choices || [];
  for (let i = 0; i < choices.length; i += 1) {
    const choice = choices[i];
    html += "<li>Choice bonus: +" + choice.amount + " to " + choice.count + " choice(s) from " + choice.options.join(", ") + "</li>";
  }
  html += "<li>Base Movement: " + movement + "</li>";
  html += "</ul>";

  ui.lineageInfo.innerHTML = html;
}

function renderBirthsignSection() {
  const sign = BIRTHSIGNS[state.birthsign];
  ui.birthsignNotes.textContent = sign.notes || "";
  renderChoiceControls(ui.birthsignOptions, sign.choices || [], state.birthsignChoiceValues, "birthsign");
  renderBirthsignDetails();
}

function renderBirthsignDetails() {
  const key = state.birthsign;
  const sign = BIRTHSIGNS[key] || {};
  const lore = BIRTHSIGN_LORE[key] || "Lore text not available.";

  const extra = [];
  if (sign.attrs) {
    extra.push("Attribute modifiers: " + formatMapAsBonusList(sign.attrs).join(", "));
  }
  if (sign.skills) {
    extra.push("Skill modifiers: " + formatMapAsBonusList(sign.skills).join(", "));
  }
  if (sign.choices && sign.choices.length) {
    for (let i = 0; i < sign.choices.length; i += 1) {
      const choice = sign.choices[i];
      extra.push("Choice bonus: +" + choice.amount + " to " + choice.count + " choice(s) from " + choice.options.join(", "));
    }
  }

  let html = "";
  html += "<h3>" + key + "</h3>";
  html += "<p>" + lore + "</p>";
  html += "<p><strong>Boon</strong></p>";
  html += "<p>" + (sign.notes || "No boon listed.") + "</p>";
  html += "<p><strong>Additional / Mechanical Effects</strong></p>";
  html += "<ul>" + listToHtml(extra, "No additional effects listed.") + "</ul>";

  ui.birthsignInfo.innerHTML = html;
}

function formatMapAsBonusList(mapObject) {
  const list = [];
  const keys = Object.keys(mapObject);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = mapObject[key];
    const prefix = value >= 0 ? "+" : "";
    list.push(prefix + value + " " + key);
  }
  return list;
}

function listToHtml(list, fallback) {
  if (!list || list.length === 0) {
    return "<li>" + fallback + "</li>";
  }
  let html = "";
  for (let i = 0; i < list.length; i += 1) {
    html += "<li>" + list[i] + "</li>";
  }
  return html;
}

function renderChoiceControls(container, choices, stateBag, bagName) {
  container.innerHTML = "";
  if (!choices.length) {
    return;
  }

  for (let c = 0; c < choices.length; c += 1) {
    const choice = choices[c];
    for (let i = 0; i < choice.count; i += 1) {
      const key = choice.id + "_" + i;
      if (!stateBag[key]) {
        stateBag[key] = choice.options[0];
      }

      const box = document.createElement("div");
      box.className = "attribute-box";

      const label = document.createElement("label");
      label.textContent = choice.id + " (" + (i + 1) + "/" + choice.count + ")";

      const select = document.createElement("select");
      fillSelectFromList(select, choice.options);
      select.value = stateBag[key];
      select.addEventListener("change", function () {
        stateBag[key] = select.value;
        renderPage();
      });

      box.append(label, select);
      container.appendChild(box);
    }
  }

  if (bagName === "birthsign" && state.birthsign === "The Thornweave") {
    const chosen = state.birthsignChoiceValues.thornweaveSkill_0 || "Enchanting";
    const other = chosen === "Enchanting" ? "Alchemy" : "Enchanting";
    const note = document.createElement("p");
    note.className = "subtext";
    note.textContent = "Thornweave also grants +5 to " + other + ".";
    container.appendChild(note);
  }
}

function renderAttributes() {
  const attrs = getFinalAttributes();
  const pointsUsed = totalAttributePointsSpent();
  const pointsLeft = 30 - pointsUsed;

  if (state.buildMode === "custom") {
    ui.attributeGuide.textContent = "Set all to 40 and distribute 30 points. Max 65 before lineage/birthsign bonuses.";
    ui.attributePool.textContent = "Points Remaining: " + pointsLeft;
  } else {
    ui.attributeGuide.textContent = "Archetype attributes are fixed; only lineage and birthsign adjustments apply.";
    ui.attributePool.textContent = "Archetype mode (view-only)";
  }

  ui.attributeGrid.innerHTML = "";
  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    const attr = ATTRIBUTES[i];
    const row = document.createElement("div");
    row.className = "attribute-box";

    const top = document.createElement("div");
    top.className = "attribute-top";
    top.innerHTML = "<strong>" + attr + "</strong><span>" + attrs[attr] + "</span>";
    row.appendChild(top);

    if (state.buildMode === "custom") {
      const controls = document.createElement("div");
      controls.className = "point-controls";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "-";
      minus.addEventListener("click", function () {
        if (state.customAttrSpend[attr] > 0) {
          state.customAttrSpend[attr] -= 1;
          renderPage();
        }
      });

      const spent = document.createElement("span");
      spent.textContent = "+" + state.customAttrSpend[attr];

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.addEventListener("click", function () {
        const candidate = 40 + state.customAttrSpend[attr] + 1;
        if (pointsLeft > 0 && candidate <= 65) {
          state.customAttrSpend[attr] += 1;
          renderPage();
        }
      });

      controls.append(minus, spent, plus);
      row.appendChild(controls);
    }

    ui.attributeGrid.appendChild(row);
  }
}

function totalAttributePointsSpent() {
  let total = 0;
  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    total += state.customAttrSpend[ATTRIBUTES[i]];
  }
  return total;
}

function renderSkillPickers() {
  ui.majorPoints.textContent = String(state.majorPoints);
  ui.minorPoints.textContent = String(state.minorPoints);
  ui.miscPoints.textContent = String(state.miscPoints);

  if (state.buildMode === "archetype") {
    const setup = getCurrentSkillSetup();
    ui.majorSkillPicker.innerHTML = "<p class='subtext'>Archetype major skills: " + setup.major.join(", ") + "</p>";
    ui.minorSkillPicker.innerHTML = "<p class='subtext'>Archetype minor skills: " + setup.minor.join(", ") + "</p>";
    return;
  }

  ui.majorSkillPicker.innerHTML = "";
  ui.minorSkillPicker.innerHTML = "";
  for (let i = 0; i < SKILL_DEFS.length; i += 1) {
    const skillName = SKILL_DEFS[i].name;
    ui.majorSkillPicker.appendChild(buildSkillPickerCheckbox(skillName, "major"));
    ui.minorSkillPicker.appendChild(buildSkillPickerCheckbox(skillName, "minor"));
  }
}

function buildSkillPickerCheckbox(skillName, tier) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";

  const ownList = tier === "major" ? state.majorSelected : state.minorSelected;
  const otherList = tier === "major" ? state.minorSelected : state.majorSelected;

  input.checked = ownList.includes(skillName);
  input.addEventListener("change", function () {
    if (input.checked) {
      if (ownList.length >= 5 || otherList.includes(skillName)) {
        input.checked = false;
        return;
      }
      ownList.push(skillName);
    } else {
      const index = ownList.indexOf(skillName);
      if (index >= 0) {
        ownList.splice(index, 1);
      }
    }

    resetSkillPointPools();
    renderPage();
  });

  label.append(input, document.createTextNode(" " + skillName));
  return label;
}

function getCurrentSkillSetup() {
  if (state.buildMode === "archetype") {
    return {
      major: ARCHETYPES[state.archetype].major.slice(),
      minor: ARCHETYPES[state.archetype].minor.slice()
    };
  }
  return {
    major: state.majorSelected.slice(),
    minor: state.minorSelected.slice()
  };
}

function getSkillTier(skillName) {
  const setup = getCurrentSkillSetup();
  if (setup.major.includes(skillName)) {
    return "Major";
  }
  if (setup.minor.includes(skillName)) {
    return "Minor";
  }
  return "Misc";
}

function renderSkillTables() {
  const attrs = getFinalAttributes();
  const values = getSkillValues();

  const groups = {
    Major: [],
    Minor: [],
    Misc: []
  };

  for (let i = 0; i < SKILL_DEFS.length; i += 1) {
    const def = SKILL_DEFS[i];
    groups[getSkillTier(def.name)].push(def);
  }

  ui.skillTableWrap.innerHTML = "";
  const tiers = ["Major", "Minor", "Misc"];
  for (let i = 0; i < tiers.length; i += 1) {
    ui.skillTableWrap.appendChild(buildSkillTableSection(tiers[i], groups[tiers[i]], values, attrs));
    if (i < tiers.length - 1) {
      const divider = document.createElement("div");
      divider.className = "section-divider";
      ui.skillTableWrap.appendChild(divider);
    }
  }
}

function buildSkillTableSection(tier, defs, values, attrs) {
  const section = document.createElement("section");
  section.className = "skill-box";
  section.innerHTML = "<h3>" + tier + " Skills</h3>";

  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  const table = document.createElement("table");
  table.innerHTML = ""
    + "<thead><tr>"
    + "<th>Skill</th><th>Value</th><th>Cap</th><th>Adjust (" + getPoolByTier(tier) + " left)</th>"
    + "</tr></thead><tbody></tbody>";

  const body = table.querySelector("tbody");
  if (!defs.length) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = "<td colspan='4'>No skills in this tier yet.</td>";
    body.appendChild(emptyRow);
  }

  for (let i = 0; i < defs.length; i += 1) {
    const def = defs[i];
    const cap = skillCap(def, attrs);
    const value = values[def.name];

    const row = document.createElement("tr");
    row.innerHTML = "<td>" + def.name + "</td><td>" + value + "</td><td>" + cap + "</td><td class='adjust-controls'></td>";
    const controls = row.querySelector(".adjust-controls");

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "adjust-btn adjust-btn-minus";
    minus.textContent = "-1";
    minus.disabled = getAllocatedPoints(def.name, tier) <= 0;
    minus.addEventListener("click", function () {
      changeSkillAllocation(def.name, -1);
    });

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "adjust-btn";
    plus.textContent = "+1";
    plus.disabled = value >= cap || getPoolByTier(tier) <= 0;
    plus.addEventListener("click", function () {
      changeSkillAllocation(def.name, 1);
    });

    controls.append(minus, plus);
    body.appendChild(row);
  }

  wrap.appendChild(table);
  section.appendChild(wrap);
  return section;
}

function getPoolByTier(tier) {
  if (tier === "Major") {
    return state.majorPoints;
  }
  if (tier === "Minor") {
    return state.minorPoints;
  }
  return state.miscPoints;
}

function getAllocatedPoints(skillName, tier) {
  if (tier === "Major") {
    return state.majorAlloc[skillName] || 0;
  }
  if (tier === "Minor") {
    return state.minorAlloc[skillName] || 0;
  }
  return state.miscAlloc[skillName] || 0;
}

function changeSkillAllocation(skillName, amount) {
  const tier = getSkillTier(skillName);
  const values = getSkillValues();
  const attrs = getFinalAttributes();
  const def = SKILL_DEFS.find(function (item) {
    return item.name === skillName;
  });
  if (!def) {
    return;
  }

  const cap = skillCap(def, attrs);

  if (amount > 0) {
    if (values[skillName] >= cap) {
      return;
    }
    if (tier === "Major" && state.majorPoints > 0) {
      state.majorAlloc[skillName] = (state.majorAlloc[skillName] || 0) + 1;
      state.majorPoints -= 1;
    } else if (tier === "Minor" && state.minorPoints > 0) {
      state.minorAlloc[skillName] = (state.minorAlloc[skillName] || 0) + 1;
      state.minorPoints -= 1;
    } else if (tier === "Misc" && state.miscPoints > 0) {
      state.miscAlloc[skillName] = (state.miscAlloc[skillName] || 0) + 1;
      state.miscPoints -= 1;
    }
  } else {
    if (tier === "Major" && (state.majorAlloc[skillName] || 0) > 0) {
      state.majorAlloc[skillName] -= 1;
      if (state.majorAlloc[skillName] <= 0) {
        delete state.majorAlloc[skillName];
      }
      state.majorPoints += 1;
    } else if (tier === "Minor" && (state.minorAlloc[skillName] || 0) > 0) {
      state.minorAlloc[skillName] -= 1;
      if (state.minorAlloc[skillName] <= 0) {
        delete state.minorAlloc[skillName];
      }
      state.minorPoints += 1;
    } else if (tier === "Misc" && (state.miscAlloc[skillName] || 0) > 0) {
      state.miscAlloc[skillName] -= 1;
      if (state.miscAlloc[skillName] <= 0) {
        delete state.miscAlloc[skillName];
      }
      state.miscPoints += 1;
    }
  }

  renderPage();
}

function getBaseAttributes() {
  const attrs = {};
  if (state.buildMode === "archetype") {
    const archetypeAttrs = ARCHETYPES[state.archetype].attrs;
    for (let i = 0; i < ATTRIBUTES.length; i += 1) {
      const attr = ATTRIBUTES[i];
      attrs[attr] = archetypeAttrs[attr];
    }
    return attrs;
  }

  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    const attr = ATTRIBUTES[i];
    attrs[attr] = 40 + state.customAttrSpend[attr];
  }
  return attrs;
}

function getFinalAttributes() {
  const attrs = getBaseAttributes();
  addAttributeMap(attrs, LINEAGES[state.lineage].attrs || {});
  addAttributeMap(attrs, BIRTHSIGNS[state.birthsign].attrs || {});

  applyChoiceEffects(attrs, {}, LINEAGES[state.lineage].choices || [], state.lineageChoiceValues, "attribute");
  applyChoiceEffects(attrs, {}, BIRTHSIGNS[state.birthsign].choices || [], state.birthsignChoiceValues, "attribute");

  for (let i = 0; i < ATTRIBUTES.length; i += 1) {
    const key = ATTRIBUTES[i];
    attrs[key] = clamp(attrs[key], 10, 75);
  }

  return attrs;
}

function addAttributeMap(target, map) {
  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    target[key] = (target[key] || 0) + map[key];
  }
}

function getSkillValues() {
  const attrs = getFinalAttributes();
  const setup = getCurrentSkillSetup();
  const skills = {};

  for (let i = 0; i < SKILL_DEFS.length; i += 1) {
    skills[SKILL_DEFS[i].name] = 5;
  }

  for (let i = 0; i < setup.major.length; i += 1) {
    skills[setup.major[i]] = 40;
  }
  for (let i = 0; i < setup.minor.length; i += 1) {
    skills[setup.minor[i]] = 25;
  }

  addSkillMap(skills, LINEAGES[state.lineage].skills || {});
  addSkillMap(skills, BIRTHSIGNS[state.birthsign].skills || {});

  const lineage = LINEAGES[state.lineage];
  if (lineage.schoolFloor) {
    for (let i = 0; i < MAGIC_SCHOOLS.length; i += 1) {
      const school = MAGIC_SCHOOLS[i];
      skills[school] = Math.max(skills[school], lineage.schoolFloor);
    }
  }

  applyChoiceEffects({}, skills, LINEAGES[state.lineage].choices || [], state.lineageChoiceValues, "skill");
  applyChoiceEffects({}, skills, BIRTHSIGNS[state.birthsign].choices || [], state.birthsignChoiceValues, "skill");

  if (state.birthsign === "The Thornweave") {
    const chosen = state.birthsignChoiceValues.thornweaveSkill_0 || "Enchanting";
    const other = chosen === "Enchanting" ? "Alchemy" : "Enchanting";
    skills[other] = (skills[other] || 0) + 5;
  }

  addSkillMap(skills, state.majorAlloc);
  addSkillMap(skills, state.minorAlloc);
  addSkillMap(skills, state.miscAlloc);

  for (let i = 0; i < SKILL_DEFS.length; i += 1) {
    const def = SKILL_DEFS[i];
    const cap = skillCap(def, attrs);
    skills[def.name] = clamp(skills[def.name], 5, cap);
  }

  return skills;
}

function addSkillMap(target, map) {
  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    target[key] = (target[key] || 0) + map[key];
  }
}

function applyChoiceEffects(attrTarget, skillTarget, choices, choiceState, mode) {
  for (let c = 0; c < choices.length; c += 1) {
    const choice = choices[c];
    for (let i = 0; i < choice.count; i += 1) {
      const key = choice.id + "_" + i;
      const selected = choiceState[key];
      if (!selected) {
        continue;
      }

      const isAttr = choice.type === "attribute" || ATTRIBUTES.includes(selected);
      if (mode === "attribute" && isAttr) {
        attrTarget[selected] = (attrTarget[selected] || 0) + choice.amount;
      }
      if (mode === "skill" && !isAttr) {
        skillTarget[selected] = (skillTarget[selected] || 0) + choice.amount;
      }
    }
  }
}

function skillCap(skillDef, attrs) {
  if (skillDef.gov.length === 1) {
    return attrs[skillDef.gov[0]];
  }
  return Math.floor((attrs[skillDef.gov[0]] + attrs[skillDef.gov[1]]) / 2);
}

function computeDerived() {
  const attrs = getFinalAttributes();
  const lineage = LINEAGES[state.lineage];
  const sign = BIRTHSIGNS[state.birthsign];

  const speedMove = Math.max(10, Math.round((attrs.SPD / 2) / 5) * 5);
  const landMove = Math.max(speedMove, lineage.baseMoveLand || 20);

  const derived = {
    "Health (HP)": Math.floor(attrs.END / 5),
    "Magicka (MP)": Math.floor(attrs.INT / 5),
    "Fatigue (FP)": Math.floor((attrs.END + attrs.STR + attrs.AGI + attrs.SPD) / 10),
    Initiative: Math.floor(attrs.AGI / 10),
    "Luck Bonus": Math.floor(attrs.LCK / 10) + (sign.luckBonusFlat || 0),
    "Melee Damage Bonus": Math.floor(attrs.STR / 20),
    "Agility Damage Bonus": Math.floor(attrs.AGI / 20),
    "Movement (land)": landMove + "m"
  };

  if (lineage.baseMoveWater) {
    derived["Movement (water)"] = lineage.baseMoveWater + "m";
  }

  return derived;
}

function renderDerived() {
  const derived = computeDerived();
  ui.derivedStatsGrid.innerHTML = "";

  const keys = Object.keys(derived);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const card = document.createElement("div");
    card.className = "derived-card";
    card.innerHTML = "<strong>" + key + "</strong><div>" + derived[key] + "</div>";
    ui.derivedStatsGrid.appendChild(card);
  }
}

function renderEquipment() {
  const skills = getSkillValues();
  const combatSkills = ["Long Blade", "Short Blade", "Blunt Weapon", "Axe", "Spear", "Marksman", "Fistfight"];
  const armorSkills = ["Heavy Armor", "Medium Armor", "Light Armor", "Unarmored"];

  let bestCombat = combatSkills[0];
  for (let i = 1; i < combatSkills.length; i += 1) {
    if (skills[combatSkills[i]] > skills[bestCombat]) {
      bestCombat = combatSkills[i];
    }
  }

  let bestArmor = armorSkills[0];
  for (let i = 1; i < armorSkills.length; i += 1) {
    if (skills[armorSkills[i]] > skills[bestArmor]) {
      bestArmor = armorSkills[i];
    }
  }

  const suggestedWeapon = STARTER_WEAPONS.find(function (item) {
    return item.skill === bestCombat;
  }) || STARTER_WEAPONS[0];

  const suggestedArmor = STARTER_ARMOR.find(function (item) {
    return item.type === bestArmor;
  }) || STARTER_ARMOR[0];

  if (!STARTER_WEAPONS.find(function (item) { return item.name === state.selectedEquipment.weapon; })) {
    state.selectedEquipment.weapon = suggestedWeapon.name;
  }
  if (!STARTER_ARMOR.find(function (item) { return item.name === state.selectedEquipment.armor; })) {
    state.selectedEquipment.armor = suggestedArmor.name;
  }
  if (!STARTER_SHIELDS.find(function (item) { return item.name === state.selectedEquipment.shield; })) {
    state.selectedEquipment.shield = "No Shield";
  }
  if (state.selectedEquipment.kit && !STARTER_KITS.find(function (item) { return item.name === state.selectedEquipment.kit; })) {
    state.selectedEquipment.kit = "";
  }

  ui.equipmentGuide.textContent = "Recommended focus: " + bestCombat + " weapon and " + bestArmor + " armor.";

  fillSelectFromList(ui.weaponSelect, STARTER_WEAPONS.map(function (item) { return item.name; }));
  fillSelectFromList(ui.armorSelect, STARTER_ARMOR.map(function (item) { return item.name; }));
  fillSelectFromList(ui.shieldSelect, STARTER_SHIELDS.map(function (item) { return item.name; }));
  fillSelectFromList(ui.kitSelect, ["None"].concat(STARTER_KITS.map(function (item) { return item.name; })));

  ui.weaponSelect.value = state.selectedEquipment.weapon;
  ui.armorSelect.value = state.selectedEquipment.armor;
  ui.shieldSelect.value = state.selectedEquipment.shield;
  ui.kitSelect.value = state.selectedEquipment.kit || "None";

  const weapon = STARTER_WEAPONS.find(function (item) { return item.name === state.selectedEquipment.weapon; });
  const armor = STARTER_ARMOR.find(function (item) { return item.name === state.selectedEquipment.armor; });
  const shield = STARTER_SHIELDS.find(function (item) { return item.name === state.selectedEquipment.shield; });
  const kit = STARTER_KITS.find(function (item) { return item.name === state.selectedEquipment.kit; });

  renderWeaponDetail(weapon);
  renderArmorDetail(armor);
  renderShieldDetail(shield);
  renderKitDetail(kit);
}

function renderWeaponDetail(weapon) {
  if (!weapon) {
    ui.weaponInfo.innerHTML = "<p class='detail-muted'>Choose a weapon to view details.</p>";
    return;
  }

  ui.weaponInfo.innerHTML = ""
    + "<h4>" + weapon.name + "</h4>"
    + "<p><strong>Skill:</strong> " + weapon.skill + "</p>"
    + "<p><strong>FP Cost:</strong> " + weapon.fp + "</p>"
    + "<p><strong>Primary Attack:</strong> " + weapon.primary + "</p>"
    + "<p><strong>Secondary Attack:</strong> " + weapon.secondary + "</p>"
    + "<p><strong>Tags:</strong> " + (weapon.tags || "None") + "</p>"
    + "<p><strong>Notes:</strong> " + weapon.notes + "</p>"
    + "<p class='detail-muted'><strong>Reference Price:</strong> " + weapon.price + "</p>";
}

function renderArmorDetail(armor) {
  if (!armor) {
    ui.armorInfo.innerHTML = "<p class='detail-muted'>Choose armor to view details.</p>";
    return;
  }

  ui.armorInfo.innerHTML = ""
    + "<h4>" + armor.name + "</h4>"
    + "<p><strong>Armor Type:</strong> " + armor.type + "</p>"
    + "<p><strong>Base AR:</strong> " + armor.baseAr + "</p>"
    + "<p><strong>Notes:</strong> " + armor.notes + "</p>"
    + "<p class='detail-muted'><strong>Reference Price:</strong> " + armor.price + "</p>";
}

function renderShieldDetail(shield) {
  if (!shield) {
    ui.shieldInfo.innerHTML = "<p class='detail-muted'>Choose shield option to view details.</p>";
    return;
  }

  ui.shieldInfo.innerHTML = ""
    + "<h4>" + shield.name + "</h4>"
    + "<p><strong>Armor Effect:</strong> " + shield.arBonus + "</p>"
    + "<p><strong>Notes:</strong> " + shield.notes + "</p>";
}

function renderKitDetail(kit) {
  if (!kit) {
    state.selectedEquipment.kit = "";
    ui.kitInfo.innerHTML = "<p class='detail-muted'>No kit selected.</p>";
    return;
  }

  state.selectedEquipment.kit = kit.name;
  ui.kitInfo.innerHTML = ""
    + "<h4>" + kit.name + "</h4>"
    + "<p><strong>Use:</strong> " + kit.notes + "</p>"
    + "<p class='detail-muted'><strong>Reference Price:</strong> " + kit.price + "</p>";
}

function getMajorMagicSchools() {
  const majorSkills = getCurrentSkillSetup().major;
  const schools = [];
  for (let i = 0; i < majorSkills.length; i += 1) {
    if (MAGIC_SCHOOLS.includes(majorSkills[i])) {
      schools.push(majorSkills[i]);
    }
  }
  return schools;
}

function renderSpells() {
  const schools = getMajorMagicSchools();
  const enabled = schools.length > 0;

  let count = 0;
  for (let i = 0; i < state.selectedSpells.length; i += 1) {
    if (state.selectedSpells[i].school && state.selectedSpells[i].spell) {
      count += 1;
    }
  }

  if (!enabled) {
    ui.spellGuide.textContent = "No magic school is currently a Major skill. Spell selection is disabled.";
  } else {
    ui.spellGuide.textContent = "Select two Apprentice spells from your Major schools (" + count + "/2 selected).";
  }

  renderSpellRow(0, ui.spellOneSchool, ui.spellOneName, schools, !enabled);
  renderSpellRow(1, ui.spellTwoSchool, ui.spellTwoName, schools, !enabled);
  renderSpellDetail(0, ui.spellOneInfo);
  renderSpellDetail(1, ui.spellTwoInfo);
}

function renderSpellRow(index, schoolSelect, spellSelect, schools, disabled) {
  const otherIndex = index === 0 ? 1 : 0;
  const selected = state.selectedSpells[index];
  const otherSpell = state.selectedSpells[otherIndex].spell;

  schoolSelect.innerHTML = "";
  spellSelect.innerHTML = "";

  const schoolPlaceholder = document.createElement("option");
  schoolPlaceholder.value = "";
  schoolPlaceholder.textContent = disabled ? "No eligible school" : "Choose school";
  schoolSelect.appendChild(schoolPlaceholder);

  for (let i = 0; i < schools.length; i += 1) {
    const option = document.createElement("option");
    option.value = schools[i];
    option.textContent = schools[i];
    schoolSelect.appendChild(option);
  }

  if (!schools.includes(selected.school)) {
    selected.school = "";
    selected.spell = "";
  }
  schoolSelect.value = selected.school;

  const spellPlaceholder = document.createElement("option");
  spellPlaceholder.value = "";
  spellPlaceholder.textContent = selected.school ? "Choose Apprentice spell" : "Choose school first";
  spellSelect.appendChild(spellPlaceholder);

  const spellOptions = selected.school ? APPRENTICE_SPELLS[selected.school] || [] : [];
  for (let i = 0; i < spellOptions.length; i += 1) {
    const spell = spellOptions[i];
    if (spell.name === otherSpell) {
      continue;
    }
    const option = document.createElement("option");
    option.value = spell.name;
    option.textContent = spell.name;
    spellSelect.appendChild(option);
  }

  const validNames = spellOptions
    .filter(function (item) {
      return item.name !== otherSpell;
    })
    .map(function (item) {
      return item.name;
    });

  if (!validNames.includes(selected.spell)) {
    selected.spell = "";
  }

  spellSelect.value = selected.spell;
  schoolSelect.disabled = disabled;
  spellSelect.disabled = disabled;
}

function renderSpellDetail(index, detailEl) {
  const entry = state.selectedSpells[index];
  if (!entry.school || !entry.spell) {
    detailEl.innerHTML = "<p class='detail-muted'>Choose a school and spell to see details.</p>";
    return;
  }

  const schoolSpells = APPRENTICE_SPELLS[entry.school] || [];
  const spell = schoolSpells.find(function (item) {
    return item.name === entry.spell;
  });

  if (!spell) {
    detailEl.innerHTML = "<p class='detail-muted'>Spell details unavailable.</p>";
    return;
  }

  detailEl.innerHTML = ""
    + "<h4>" + spell.name + "</h4>"
    + "<p><strong>School:</strong> " + entry.school + "</p>"
    + "<p><strong>Cost:</strong> " + spell.cost + "</p>"
    + "<p><strong>Effect:</strong> " + spell.details + "</p>";
}

function buildCharacterSheet() {
  const spells = [];
  for (let i = 0; i < state.selectedSpells.length; i += 1) {
    const pick = state.selectedSpells[i];
    if (!pick.school || !pick.spell) {
      continue;
    }

    const spellData = (APPRENTICE_SPELLS[pick.school] || []).find(function (item) {
      return item.name === pick.spell;
    });

    spells.push({
      school: pick.school,
      spell: pick.spell,
      cost: spellData ? spellData.cost : "",
      effect: spellData ? spellData.details : ""
    });
  }

  const weapon = STARTER_WEAPONS.find(function (item) { return item.name === state.selectedEquipment.weapon; }) || null;
  const armor = STARTER_ARMOR.find(function (item) { return item.name === state.selectedEquipment.armor; }) || null;
  const shield = STARTER_SHIELDS.find(function (item) { return item.name === state.selectedEquipment.shield; }) || null;
  const kit = STARTER_KITS.find(function (item) { return item.name === state.selectedEquipment.kit; }) || null;

  return {
    name: state.characterName || "Unnamed Adventurer",
    mode: state.buildMode,
    archetype: state.buildMode === "archetype" ? state.archetype : null,
    lineage: state.lineage,
    birthsign: state.birthsign,
    attributes: getFinalAttributes(),
    skills: getSkillValues(),
    derived: computeDerived(),
    lineageAbilities: LINEAGE_ABILITIES[state.lineage] || [],
    birthsignBoon: BIRTHSIGNS[state.birthsign].notes || "",
    archetypeBonus: state.buildMode === "archetype" ? (ARCHETYPE_INFO[state.archetype] ? ARCHETYPE_INFO[state.archetype].bonus : "") : "",
    startingSpells: spells,
    selectedEquipment: {
      weapon: weapon,
      armor: armor,
      shield: shield,
      kit: kit
    },
    notes: state.background
  };
}

function persistToStorage() {
  state.characterName = ui.characterName.value;
  state.background = ui.background.value;
  localStorage.setItem("scrolls_steel_sheet", JSON.stringify(state));
}

function restoreFromStorage() {
  const raw = localStorage.getItem("scrolls_steel_sheet");
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    if (!state.customAttrSpend) {
      state.customAttrSpend = buildEmptyAttributeSpend();
    }
    if (!state.selectedSpells || state.selectedSpells.length !== 2) {
      state.selectedSpells = [{ school: "", spell: "" }, { school: "", spell: "" }];
    }
    if (!state.selectedEquipment) {
      state.selectedEquipment = { weapon: "", armor: "", shield: "No Shield", kit: "" };
    }
  } catch (error) {
    console.error("Unable to restore saved character sheet", error);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
