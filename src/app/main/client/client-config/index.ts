export interface TGConfig {
  musicVolume: number;
  soundVolume: number;
  news: boolean,
  layout: {
    fontSize: number,
    extraOutput: boolean,
    characterPanel: boolean,
    characterPanelTopPosition: boolean,
    zen: boolean,
  }
}

export const tgConfig: TGConfig = {
  musicVolume: 1,
  soundVolume: 0.7,
  news: true,
  layout: {
    fontSize: 2,
    extraOutput: true,
    characterPanel: true,
    characterPanelTopPosition: false,
    zen: false
  }
}