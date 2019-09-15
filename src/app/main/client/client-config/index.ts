
export interface TGConfig {
  audio: {
    enable: boolean;
    musicVolume: number;
    soundVolume: number;
  };
  logSave: boolean;
  fontSize: number;
  output: {
    extraArea: {
      visible: boolean,
      size: number[],
    },
    list_column_mode: boolean
  };
  widgetRoom: {
    visible: boolean,
    size: number,
  };
  widgetEquipInv: {
    visible: boolean,
    size: number | string,
    collapsed: boolean
  };
  widgetCombat: {
    visible: boolean,
    size: number
  };
  openEquipInvWidgets: boolean,
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
  logSave: true,
  fontSize: 2,
  output: {
    extraArea: {
      visible: true,
      size: [50, 50]
    },
    list_column_mode: true
  },
  widgetRoom: {
    visible: true,
    size: undefined
  },
  widgetEquipInv: {
    visible: true,
    size: 250,
    collapsed: false
  },
  widgetCombat: {
    visible: false,
    size: undefined
  },
  openEquipInvWidgets: true,
  characterPanel: true,
  characterPanelTopPosition: 1,
  zen: false,
  tablePageSize: 20,
  log: true,
  shortcuts: [],
};
