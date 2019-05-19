
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
  characterPanelTopPosition: number;
  zen: boolean;
  tablePageSize: number;
  log: boolean;
  shortcuts: any[];
}


/** DEFAULT CONFIG */
export const tgConfig: TGConfig = {
  audio: {
    enable: true,
    musicVolume: 100,
    soundVolume: 70,
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
  characterPanelTopPosition: 1,
  zen: false,
  tablePageSize: 20,
  log: true,
  // shortcuts: undefined
  shortcuts: [],
};
