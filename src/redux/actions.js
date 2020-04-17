/*

Reference - http://devguides.io/redux/actions

Whenever user shows interest to change application state, like click action on `Sort move` button, then that
action get created here. These are all action creators.
And then respective action in reducer gets called from here, which in turns, changes the application state.

Action creators is a simple function that creates an action. They don't have to be only for asynchronous actions. Even simple actions can have action creators.
These actions are dispatched to the store and handled in reducers.
Redux says, Action should REPORT things that happened, not MAKE things happen. 

Action is payload of information and action creator is factory that creates a action.
Payload is part of transmitted data that is actual intended message.

*/

import { TOGGLE_SWITCH, ASSIGN_WINNER, ASSIGN_WINNER_SQUARES, CHANGE_GAME_STATE } from "./actionTypes";

export const toggleswitch = enabled => ({
	type: TOGGLE_SWITCH,
	payload: { enabled },
});

export const assignWinner = winner => ({
	type: ASSIGN_WINNER,
	payload: { winner },
});

export const assignWinnerSquares = winnerSquares => ({
	type: ASSIGN_WINNER_SQUARES,
	payload: { winnerSquares },
});

export const changeGameState = gameState => ({
	type: CHANGE_GAME_STATE,
	payload: { gameState },
});

