import { ActionReducer, Action } from '@ngrx/store';
import { GameState } from './game.state';
import { GameStatus } from './game.const';

// const INITIAL_STATE: GameState = {
//     players: undefined,
//     time: undefined,
//     state: GameStatus.INIT
// };

// export const gameReducer: ActionReducer<GameState> = (state: GameState = INITIAL_STATE, action: Action) => {
//     switch (action.type) {

//         default:
//             return state;
//     }
//     //     switch(action.type) {
//     //         default:
//     //             return state;
//     //             // return Object.assign({}, state, action.payload);
//     //     }
// }
