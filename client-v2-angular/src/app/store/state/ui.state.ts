
export interface UIState {
  isgod: number;
  invLevel: number;
  welcomeNews: boolean;
  musicVolume: number;
  soundVolume: number;
  track?: any;
  inputVisible: boolean;
  cursorOnMap: false; // Remove
  editorIsopen: boolean;
  extraOutput: boolean;
  showDashBoard: boolean;


}

export const initialState: UIState = {
  isgod: 0,
  invLevel: 0,
  welcomeNews: false,
  musicVolume: 100,
  soundVolume: 70,
  track: undefined,
  inputVisible: true,
  cursorOnMap: false,
  editorIsopen: false,
  extraOutput: true,
  showDashBoard: true,
};
