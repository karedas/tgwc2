export const equip_positions_by_name = {
    'r_finger': 'Al dito destro',
    'l_finger': 'Al dito sinistro',
    'neck': 'Al collo',
    'body': 'Sul corpo',
    'head': 'In testa',
    'legs': 'Sulle gambe',
    'feet': 'Ai piedi',
    'hands': 'Sulle mani',
    'arms': 'Sulle braccia',
    'around': 'Attorno al corpo',
    'waist': 'In vita',
    'r_wrist': 'Al polso destro',
    'l_wrist': 'Al polso sinistro',
    'r_hand': 'Nella mano destra',
    'l_hand': 'Nella mano sinistra',
    'back': 'Sulla schiena',
    'r_ear': 'All\'orecchio destro',
    'l_ear': 'All\'orecchio sinistro',
    'eyes': 'Sugli occhi',
    'sheath': 'Nel fodero',
    'belt': 'Alla cintura',
    'over': 'A tracolla',
    'r_shoulder': 'Sulla spalla destra',
    'l_shoulder': 'Sulla spalla sinistra',
    'tied': 'Imprigionato'
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

export const skillValue = {
  10: 'scarso',
  20: 'buono',
  50: 'ottimo',
  100: 'eccellente'
};

// Do not change order list!
export const hero_position = [
  {msg: 'morto'},
  {msg: 'ferito mortalmente'},
  {msg: 'incosciente'},
  {msg: 'addormentato', cmd: 'dormi'},
  {msg: 'sdraiato', cmd: 'sdraia' },
  {msg: 'seduto', cmd: 'siedi' },
  {msg: 'in piedi', cmd: 'alza' },
  {msg: 'sveglia', cmd: 'sveglia'}
];


export const hero_attitude = [
  {msg: 'berserk', cmd: 'comb bers'},
  {msg: 'aggressivo', cmd: 'comb agg'},
  {msg: 'coraggioso', cmd: 'comb corag'},
  {msg: 'normale', cmd: 'comb norm'},
  {msg: 'cauto', cmd: 'comb caut'},
  {msg: 'guardingo', cmd: 'comb guard'},
  {msg: 'difensivo', cmd: 'comb dif'}
]

export const hero_defense = [
  {msg: 'schivare', cmd: 'comb schiv'},
  {msg: 'parare', cmd: 'comb para'},
  {msg: 'deflettere', cmd: 'comb defle'}
]

export const hero_speed = [
  {msg: 'passeggio', cmd:'velo pass'},
  {msg: 'camminata', cmd:'velo cammin'},
  {msg: 'marcia', cmd: 'velo marcia'},
  {msg: 'corsa', cmd: 'velo corsa'},
  {msg: 'scatto', cmd: 'velo scat'}
]