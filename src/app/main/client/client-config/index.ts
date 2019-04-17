export interface TGConfig {
  audio: {
    enable: boolean;
    musicVolume: number;
    soundVolume: number;
  };
  news: boolean;
  fontSize: number;
  output: {
    extraArea:  {
      visible: boolean,
      size: number[]
    },
    list_column_mode: boolean
  };
  characterPanel: boolean;
  characterPanelTopPosition: boolean;
  zen: boolean;
  tablePageSize: number;
  log: boolean;
}


/** DEFAULT CONFIG */
export const tgConfig: TGConfig = {
  audio: {
    enable: true,
    musicVolume: 1,
    soundVolume: 0.7,
  },
  news: true,
  fontSize: 2,
  output: {
    extraArea: {
      visible: true,
      size: [50, 50]
    },
    list_column_mode: true
  },
  characterPanel: true,
  characterPanelTopPosition: false,
  zen: false,
  tablePageSize: 20,
  log: true
};
