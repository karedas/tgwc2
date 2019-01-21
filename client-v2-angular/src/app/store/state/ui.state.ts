export interface UIState {
	isgod: number;
	invlevel: number;
	welcomeNews: boolean;
	musicVolume: number;
	soundVolume: number;
	inputVisible: boolean;
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
	showDashBoard: boolean;
	zen: boolean;


}

export const initialState: UIState = {
	isgod: 0,
	invlevel: undefined,
	welcomeNews: false,
	musicVolume: 100,
	soundVolume: 70,
	inputVisible: true,
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
	extraOutput: true,
	showDashBoard: true,
	zen: false
};
