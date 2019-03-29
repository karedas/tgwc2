export interface TGConfig {
  musicVolume: number;
  soundVolume: number;
  news: boolean,
  layout: {
    extraOutput: boolean,
    characterPanel: boolean,
    zen: boolean,
  }
}

export const tgConfig: TGConfig = {
  musicVolume: 100,
  soundVolume: 70,
  news: true,
  layout: {
    extraOutput: true,
    characterPanel: true,
    zen: false
  }
}