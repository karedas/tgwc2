import { initialState, DataState } from '../state/data.state';
import { DataAction, DataEvenType } from '../actions/data.action';

export function reducer(
	state = initialState,
	action: DataAction
): DataState {
	switch (action.type) {
		case DataEvenType.IN:
			return Object.assign({}, state, action.payload);
		case DataEvenType.OUT:
			return Object.assign({}, state, action.payload);
		case DataEvenType.PLAYERSTATUS:
			return Object.assign({}, state, action.payload);
		case DataEvenType.DOORS:
			return Object.assign({}, state, {
				doors: action.payload,
				lastType: 'doors'
			});
		case DataEvenType.ROOM:
			return Object.assign({}, state, {
				room: action.payload,
				lastType: 'room'
			});
		case DataEvenType.MAP:
			return Object.assign({}, state, {
				map: action.payload,
				lastType: 'map'
			});
		case DataEvenType.SKY:
			return Object.assign({}, state, {
				sky: action.payload,
				lastType: 'sky'
		})
		default:
			return state;
	}
}
