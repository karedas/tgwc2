
export interface UIState {
  isgod: number;
  invLevel: number;
  musicVolume: number;
  soundVolume: number;
  track?: any;
  inputVisible: boolean;
  cursorOnMap: false; // Remove
  editorIsopen: boolean;
}

export const initialState: UIState = {
  isgod: 0,
  invLevel: 0,
  musicVolume: 100,
  soundVolume: 70,
  track: undefined,
  inputVisible: true,
  cursorOnMap: false,
  editorIsopen: false
};
