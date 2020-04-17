
/*

Reducers reads the action and decides what to do based on action.
It receives initial state and action and changes the state based on action and return the changed state.

*/
import  { TOGGLE_SWITCH, ASSIGN_WINNER, ASSIGN_WINNER_SQUARES, CHANGE_GAME_STATE } from "../actionTypes";

const initialState = {
	currentToggleState: false,
	winner: null,
	winnerSquares: null,
	gameWon: null
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

		case ASSIGN_WINNER: {
			const { winner } = action.payload;
			return {
				...state,
				winner: winner
			}
		}

		case ASSIGN_WINNER_SQUARES: {
			const { winnerSquares } = action.payload;
			return {
				...state,
				winnerSquares: winnerSquares
			}
		}

		case CHANGE_GAME_STATE: {
			const { gameState } = action.payload;
			return {
				...state,
				gameWon: gameState
			}
		}
		default:
			return state;
	}
}

