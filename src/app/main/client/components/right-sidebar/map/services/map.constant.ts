export const terrainsCastShadow = [17, 24, 27, 45, 46, 47, 50, 51, 52, 60];
export const terrainsHasShadow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 31, 41, 43, 44];

export const doors = [51, 52, 53, 54]

export const walls   = {
  around:[17, 24, 27, 45, 46, 47, 50, 51, 52, 53, 54, 55, 59, 60],
  tiles: [
    {
      n: true,
      e: true,
      s: true,
      w: true,
      cords: [32, 32]
    },
    {
      n: undefined,
      e: true,
      s: true,
      w: false,
      cords: [0, 32]
    },
    {
      n: false,
      e: undefined,
      s: true,
      w: true,
      cords: [32, 0]
    },
    {
      n: false,
      e: true,
      s: true,
      w: undefined,
      cords: [32, 0]
    },
    // vertical
    {
      n: true,
      e: false,
      w: true,
      s: true,
      cords: [96, 32]
    },
    {
      n: true,
      e: true,
      w: false,
      s: true,
      cords: [0, 32]
    },
    // horizontal
    {
      n: true,
      e: true,
      s: false,
      w: true,
      cords: [32, 64]
    },
    {
      n: false,
      e: true,
      s: true,
      w: true,
      cords: [32, 0]
    },
    // borders
    {
      n: false,
      e: false,
      s: true,
      w: true,
      cords: [96, 0]
    },
    {
      n: false,
      e: true,
      s: true,
      w: false,
      cords: [0, 0]
    },
    {
      n: true,
      e: true,
      s: false,
      w: false,
      cords: [0, 64]
    },
    {
      n: true,
      e: false,
      s: false,
      w: true,
      cords: [0, 64]
    },
    {
      n: false,
      e: true,
      s: false,
      w: false,
      cords: [32, 64],
    },
    // special condition
    {
      n: true,
      e: false,
      s: false,
      w: false,
      cords: [32, 64]
    },
    {
      n: false,
      e: false,
      s: true,
      w: false,
      cords: [32, 0]
    }
  ]

};
