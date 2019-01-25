
export interface UIState {
  isgod: number;
  invlevel: number;
  welcomeNews: boolean;
  musicVolume: number;
  soundVolume: number;
  track?: any;
  inputVisible: boolean;
  cursorOnMap: false; // Remove
  editorIsopen: boolean;
  extraOutput: boolean;
  showDashBoard: boolean;
  zen: boolean;


}

export const initialState: UIState = {
  isgod: 0,
  invlevel: undefined,
  welcomeNews: false,
  musicVolume: 100,
  soundVolume: 70,
  track: undefined,
  inputVisible: true,
  cursorOnMap: false,
  editorIsopen: false,
  extraOutput: false,
  showDashBoard: true,
  zen: false
};
