
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import Switch from './components/ToggleSwitch';
import { Provider, connect } from 'react-redux';
import store from "./redux/store";
import { assignWinner, assignWinnerSquares, changeGameState } from "./redux/actions";

function Square(props){

	return (
		<button 
			className={props.class} 
			onClick={props.onClick}
		>
		{props.value}
		</button>
	);
}

class Board extends React.Component {

	// Render a square
	renderSquare(i) {
		let classString = "square";
		if(this.props.winnerSquares && this.props.winnerSquares[i] != null)
			classString += " winner";

		return (
			<Square key={i}
				value={this.props.squares[i]}
				class={classString}
				onClick = {() => this.props.onClick(i)}
			/>
		);
	}

	/*
	Generate board to make squares
	To generate square board dynamically - https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
	*/
	generateSquareBoard() {

		let table = [];
		let index = 0;	// square index
		for(let i=0; i<3; i++) {

			let children = [];
			for(let j=0; j<3; j++) {
				children.push(this.renderSquare( index ))
				index = index + 1;
			}

			table.push(<div key={i} className="board-row">{children}</div>);
		}

		return table
	}

	// Render board component
	render() {
		return(
			<div>
				{this.generateSquareBoard()}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		// initialize squares and location values
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				location: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		}
	}

	// square click event handler
	handleClick(i) {

		/*
		slice() function returns shallow copy of array into new array object
		We can udpate the array directly but we have to show move history
		https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important
		*/
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		// ignore click event if winner is declared or clicked square is filled
		if(this.props.winner || squares[i]) {
			return;
		}

		// assign respective value(X or O) to clicked square accordingly
		squares[i] = this.state.xIsNext ? 'X' : 'O';

		const clickedLocation = this.getLocationOfMove(i);
		const location = current.location.slice();
		// assign location value
		location[this.state.stepNumber] = clickedLocation[0]+','+clickedLocation[1];

		// update states
		this.setState({
			history: history.concat([{
				squares: squares,
				location: location,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});

		this.calculateWinner(squares);
	}

	// Jump to any previous move state
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) === 0,
		});
	}

	// Calculate the winner
	calculateWinner(squares) {
		// array of positions in squareborad on which basis winner can be declared
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for(let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				this.props.assignWinner(squares[a]);

				// store the three suares that caused to win
				var winnerSquares = Array(9).fill(null);
				winnerSquares[a] = a;
				winnerSquares[b] = b;
				winnerSquares[c] = c;
				this.props.assignWinnerSquares(winnerSquares);

				this.props.changeGameState(true);
				// store winner, X or 0 and winning squares in result
				//const result = [squares[a], winner];
				
				// return the game result
				//return result;

			} else if(this.state.stepNumber === 8 && i === 7) {
				console.log(this.state.stepNumber);
				this.props.changeGameState(false);
			}
		}
		//return null;
	}

	// get column and row of clicked square
	getLocationOfMove(move){
		const location = [];
		if(move === 0) {
			location[0] = 1;
			location[1] = 1;
		} else if(move === 1) {
			location[0] = 1;
			location[1] = 2;
		} else if(move === 2) {
			location[0] = 1;
			location[1] = 3;
		} else if(move === 3) {
			location[0] = 2;
			location[1] = 1;
		} else if(move === 4) {
			location[0] = 2;
			location[1] = 2;
		} else if(move === 5) {
			location[0] = 2;
			location[1] = 3;
		} else if(move === 6) {
			location[0] = 3;
			location[1] = 1;
		} else if(move === 7) {
			location[0] = 3;
			location[1] = 2;
		} else if(move === 8) {
			location[0] = 3;
			location[1] = 3;
		}
		return location;
	}

	// Render game component
	render() {
		let currentToggleState = this.props.currentToggleState;
		const history = this.state.history;
		const current = history[this.state.stepNumber];				// get current state using stepNumber
		const squares = current.squares;
		//this.calculateWinner(squares);
		//const winner = (result != null) ? result[0] : null;
		//const winnerSquares = (result != null) ? result[1] : '';
		//console.log(winnerSquares);
		const historyLength = history.length;
		let location = current.location;

		/*
		If currentToggleState is true then arrange locations in descending order
		reverse() function is available but if array contains null values then it does not work as we expects
		and that's why we reverse it maually as per requirement
		*/
		if(currentToggleState)
		{
			// get only not-null locations
			location = location.filter(location => location != null);
			// reverse them
			var reverseLocation = location.reverse();
			// create a new blank array and fill it with null values
			var nullArray = Array(9 - reverseLocation.length);
			nullArray.fill(null);
			// concat above reversed locations
			location = reverseLocation.concat(nullArray);
		}

		// Generate move history using history stored in component state
		const moves = history.map((step, index) => {
			
			let moveIndex;
			let moveText;
			let condition;
			let locationIndex;

			/*
			If currentToggleState is true
			then history and location should be traversed in descending order
			and to traverse them likewise, manipulate required indexs accordingly
			*/
			if(currentToggleState)
			{
				moveIndex = historyLength-(index+1);
				condition = (index !== (historyLength-1));
				locationIndex = index;
			}
			else
			{
				moveIndex = index;
				condition = index;
				locationIndex = index-1;
			}
			moveText = condition ? 'Go to move #'+moveIndex : 'Go to game start';

			/*
			Bold the currently selected item in the move list.
			Inserted <span> deliberately below
			If you don't inserted any html tag, it gives error, need to check why it is like this.
			*/
			const bold = ((index+1) === historyLength) ?
				<b>{moveText} - {location[locationIndex]}</b> :
				<span>{moveText} - {location[locationIndex]}</span>;

			return (
				<li key={moveIndex}>
					<button onClick={() => this.jumpTo(moveIndex)}>{bold}</button>
				</li>
			);
			
		});

		let status;
		//console.log(this.props.winnerSquares);
		if(this.props.winner) {
			status = 'Winner: ' + this.props.winner;
		} else {
			//status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
			status = (this.props.gameWon == null) ? ('Next Player: ' + (this.state.xIsNext ? 'X' : 'O')) : 'Game Draw';
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={squares}
						winnerSquares={this.props.winnerSquares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{ status }</div>
					<ol>{ moves }</ol>
				</div>
				<div className="d-flex p-4 rounded float-right">
					<Switch theme="default" className="d-flex" />
					<span className="font-weight-light">Sort Move</span>
				</div>
			</div>
		);
	}
}

/*
This function used for selecting required data from store and passed as first parameter to connect
It is called every time store state changes
*/
function mapStateToProps(state) {
	const { currentToggleState, winner, winnerSquares, gameWon } = state;
	return { currentToggleState, winner, winnerSquares, gameWon };
}

// This function connects a React component to a Redux store
Game = connect(mapStateToProps, {assignWinner, assignWinnerSquares, changeGameState})(Game);

ReactDom.render(
	/*
	Wrap main app (which should be your top-most component i.e. Game) inside <Provider>.
	This lets your component see the store
	*/
	<Provider store={store}>
		<Provider store={store}>
			<Game />
		</Provider>
	</Provider>,
	document.getElementById('root')
);

