export const equipPositionByName = {
  r_finger: 'Dito dx',
  l_finger: 'Dito sx',
  neck: 'Al collo',
  body: 'Sul corpo',
  head: 'In testa',
  legs: 'Sulle gambe',
  feet: 'Ai piedi',
  hands: 'Sulle mani',
  arms: 'Sulle braccia',
  around: 'Attorno al corpo',
  waist: 'In vita',
  r_wrist: 'Polso dx',
  l_wrist: 'Polso sx',
  r_hand: 'Mano dx',
  l_hand: 'Mano sx',
  back: 'Schiena',
  r_ear: 'Orecchio dx',
  l_ear: 'Orecchio sx',
  eyes: 'Sugli occhi',
  sheath: 'Nel fodero',
  belt: 'Alla cintura',
  over: 'A tracolla',
  r_shoulder: 'Spalla dx',
  l_shoulder: 'Spalla sx',
  tied: 'Imprigionato'
};

export const pos_to_order = [
  { pos: 0, name: '' },
  18,		// Finger R
  19,		// Finger L
  5,		// Neck
  8,		// Body
  1,		// Head
  23,		// Legs
  24,		// Feet
  15,		// Hands
  12,		// Arms
  9,		// About
  22,		// Waist
  13,		// Wrist R
  14,		// Wrist L
  160,	// Hand R
  170,	// Hand L
  10,		// Back
  2,		// Ear R
  3,		// Ear L
  4,		// Eyes
  20,		// Sheath
  21,		// Belt
  11,		// Back
  6,		// Shoulder R
  7,		// Shoulder L
  25		// Tied
];

export const font_size_options = [
  {
    name: 'Piccolissimo',
    class: 'xs'
  },
  {
    name: 'Piccolo',
    class: 's'
  },
  {
    name: 'Medio',
    class: 'm'
  },
  {
    name: 'Grande',
    class: 'l'
  },
  {
    name: 'Grandissimo',
    class: 'xl'
  },
  {
    name: 'Gigantesco',
    class: 'xxl'
  },
  {
    name: 'Enorme',
    class: 'xxxl'
  }
];


// Do not change order list!
export const hero_position = [
  { msg: 'morto' },
  { msg: 'ferito mortalmente' },
  { msg: 'incosciente' },
  { msg: 'addormentato', cmd: 'dormi' },
  { msg: 'sdraiato', cmd: 'sdraia' },
  { msg: 'seduto', cmd: 'siedi' },
  { msg: 'in piedi', cmd: 'alza' },
  { msg: 'sveglia', cmd: 'sveglia' }
];


export const hero_attitude = [
  { msg: 'berserk', cmd: 'comb bers' },
  { msg: 'aggressivo', cmd: 'comb agg' },
  { msg: 'coraggioso', cmd: 'comb corag' },
  { msg: 'normale', cmd: 'comb norm' },
  { msg: 'cauto', cmd: 'comb caut' },
  { msg: 'guardingo', cmd: 'comb guard' },
  { msg: 'difensivo', cmd: 'comb dif' }
];

export const hero_defense = [
  { msg: 'schivare', cmd: 'comb schiv' },
  { msg: 'parare', cmd: 'comb para' },
  { msg: 'deflettere', cmd: 'comb defle' }
];

export const hero_speed = [
  { msg: 'scatto', cmd: 'velo scat' },
  { msg: 'corsa', cmd: 'velo corsa' },
  { msg: 'marcia', cmd: 'velo marcia' },
  { msg: 'camminata', cmd: 'velo cammin' },
  { msg: 'passeggio', cmd: 'velo pass' }
];

export const hero_skills = [
  'Incapace',
  'Scarso',
  'Sotto la media',
  'Nella media',
  'Sopra la media',
  'Abile',
  'Molto abile',
  'Eccellente',
  'Maestro',
  'Eroico',
  'Leggendario'
];
