export const terrainsCastShadow = [17, 24, 27, 45, 46, 47, 50, 51, 52, 60];
export const terrainsHasShadow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 31, 41, 43, 44];

export const doors = [51, 52, 53, 54]

export const walls   = {
  // Deèrecate
  around:[17, 24, 27, 45, 46, 47, 50, 51, 52, 53, 54, 55, 59, 60],
  allowed: [50],
  tiles: [
    //special side
    {
      alias: 's-tl',
      n: [59],
      e: [51],
      s: [50],
      w: [59],
      pos: [4, 0] 
    },
    {
      alias: 's-tr',
      n: [59],
      e: [59],
      s: [50],
      w: [51],
      pos: [3, 0] 
    },
    {
      alias: 's-ht',
      n: [1],
      e: [53],
      s: [1],
      w: [50],
      pos: [6, 0] 
    },
    // Borders: 
    {
      alias: 'bord-br',
      n: [17,50, 59, 51, 52, 53, 54],
      e: [1],
      s: [1],
      w: [50, 59, 51, 52, 53, 54],
      pos: [7, 0] 
    },
    {
      alias: 'bord-bl',
      n: [17, 50, 59, 51, 52, 53, 54],
      e: [50, 59, 51, 52, 53, 54],
      s: [1],
      w: [1],
      pos: [5, 0] 
    },
    {
      alias: 'bord-tr',
      n: [1],
      e: [50, 59, 51, 52, 53, 54],
      s: [50, 59, 51, 52, 53, 54],
      w: [1],
      pos: [1, 0] 
    },
    {
      alias: 'bord-tl',
      n: [1],
      e: [1],
      s: [50, 59, 51, 52, 53, 54],
      w: [50, 59, 51, 52, 53, 54],
      pos: [2, 0] 
    },
    // Vertical
    {
      alias: 'v-l',
      n: [50, 59, 51, 52, 53, 54],
      e: [1, 41],
      s: [50, 59, 51, 52, 53, 54],
      w: [59],
      pos: [4, 0] 
    },
    {
      alias: 'v-r',
      n: [50, 59, 51, 52, 53, 54],
      e: [59],
      s: [50, 59, 51, 52, 53, 54],
      w: [1,41],
      pos: [3, 0] 
    },
    // horizontal
    {
      alias: 'h-t',
      n: [41, 50, 59],
      e: [50, 59, 51, 52, 53, 54, undefined],
      s: [1],
      w: [50, 59, 51, 52, 53, 54, undefined],
      pos: [6, 0] 
    },
    {
      alias: 'h-b',
      n: [1],
      e: [50, 59, 51, 52, 53, 54, undefined],
      s: [59],
      w: [50, 59, 51, 52, 53, 54, undefined],
      pos: [0, 0] 
    },
    // {
    //   n: undefined,
    //   e: true,
    //   s: true,
    //   w: false,
    //   cords: [96, 0]
    // },
    // {
    //   n: false,
    //   e: undefined,
    //   s: true,
    //   w: true,
    //   cords: [0, 0]
    // },
    // {
    //   n: false,
    //   e: true,
    //   s: true,
    //   w: undefined,
    //   cords: [0, 0]
    // },
    // // vertical
    // {
    //   n: true,
    //   e: false,
    //   w: true,
    //   s: true,
    //   cords: [128, 0]
    // },
    // {
    //   n: true,
    //   e: true,
    //   w: false,
    //   s: true,
    //   cords: [96, 0]
    // },
    // // horizontal
    // {
    //   n: true,
    //   e: true,
    //   s: false,
    //   w: true,
    //   cords: [192, 0]
    // },
    // {
    //   n: false,
    //   e: true,
    //   s: true,
    //   w: true,
    //   cords: [0, 0]
    // },
    // // borders
    // {
    //   n: false,
    //   e: false,
    //   s: true,
    //   w: true,
    //   cords: [64, 0]
    // },
    // {
    //   n: false,
    //   e: true,
    //   s: true,
    //   w: false,
    //   cords: [32, 0]
    // },
    // {
    //   n: true,
    //   e: true,
    //   s: false,
    //   w: false,
    //   cords: [160, 0]
    // },
    // {
    //   n: true,
    //   e: false,
    //   s: false,
    //   w: true,
    //   cords: [224, 0]
    // },
    // {
    //   n: false,
    //   e: true,
    //   s: false,
    //   w: false,
    //   cords: [32, 64],
    // },
    // // special condition
    // {
    //   n: true,
    //   e: false,
    //   s: false,
    //   w: false,
    //   cords: [32, 64]
    // },
    // {
    //   n: false,
    //   e: false,
    //   s: true,
    //   w: false,
    //   cords: [32, 0]
    // }
  ]

};
