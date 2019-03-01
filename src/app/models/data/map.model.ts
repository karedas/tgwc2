export interface TileMap {
  0?: (number)[] | null;
  1?: (number)[] | null;
}

export interface Map {
  d: number;
  l: number;
  data: TileMap;
}
