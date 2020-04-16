
/*

Reducers reads the action and decides what to do based on action.
It receives initial state and action and changes the state based on action and return the changed state.

*/
import  { TOGGLE_SWITCH } from "../actionTypes";

const initialState = {
	currentToggleState: false,
};

export default function(state= initialState, action) {
	switch(action.type) {
		case TOGGLE_SWITCH: {
			const { enabled } = action.payload;
			return {
				...state,
				currentToggleState: !enabled
			};
		}
		default:
			return state;
	}
}

