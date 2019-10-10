export interface TileMap {
  0?: (number)[] | null;
  1?: (number)[] | null;
}

export interface IMap {
  d: number;
  l: number;
  data: TileMap;
  s?: any;
  f?: any;
  r?: any;
}
