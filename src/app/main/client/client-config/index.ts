export interface TGConfig {
  audio: boolean;
  musicVolume: number;
  soundVolume: number;
  news: boolean;
  layout: {
    fontSize: number,
    extraOutputDisplay: boolean,
    extraOutputSize: number,
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
    extraOutputDisplay: true,
    extraOutputSize: 50,
    characterPanel: true,
    characterPanelTopPosition: false,
    zen: false,
    list_column_mode: true
  }
};
