
export interface TGConfig {
  audio: {
    enable: boolean;
    musicVolume: number;
    soundVolume: number;
    atmosphericVolume: number;
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
    selected: string,
    size: number | string,
    collapsed: boolean
  };
  widgetCombat: {
    visible: boolean,
    size: number
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
    atmosphericVolume: 70,
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
    size: -1
  },
  widgetEquipInv: {
    visible: true,
    selected: 'equip',
    size: 250,
    collapsed: false
  },
  widgetCombat: {
    visible: false,
    size: -1
  },
  characterPanel: true,
  characterPanelTopPosition: 1,
  zen: false,
  tablePageSize: 20,
  log: true,
  shortcuts: [],
};


