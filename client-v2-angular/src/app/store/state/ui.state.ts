export interface UIState {
  welcomeNews: boolean;
  musicVolume: number;
  soundVolume: number;
  inventory: {
      version: number;
      needed: boolean;
  };
  equipment: {
      version: number;
      needed: boolean;
  };
  room: {
      version: number;
      needed: boolean;
  }; 
  cursorOnMap: false; // Remove
  editorIsopen: boolean;
  extraOutput: boolean;
  controlPanel: number;
  zen: boolean;


}

export const initialState: UIState = {
  welcomeNews: false,
  musicVolume: 100,
  soundVolume: 70,
  inventory: {
      version: -1,
      needed: false
  },
  equipment: {
      version: -1,
      needed: false
  },
  room: {
      version: -1,
      needed: false
  },
  cursorOnMap: false,
  editorIsopen: false,
  extraOutput: false,
  controlPanel: 0,
  zen: false
};
