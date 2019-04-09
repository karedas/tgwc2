export interface TGConfig {
  audio: boolean;
  musicVolume: number;
  soundVolume: number;
  news: boolean;
  layout: {
    fontSize: number,
    extraOutput: boolean,
    characterPanel: boolean,
    characterPanelTopPosition: boolean,
    zen: boolean,
    list_column_mode: boolean
  };
}

export const tgConfig: TGConfig = {
  audio: true,
  musicVolume: 1,
  soundVolume: 0.7,
  news: true,
  layout: {
    fontSize: 2,
    extraOutput: true,
    characterPanel: true,
    characterPanelTopPosition: false,
    zen: false,
    list_column_mode: true
  }
};
