
import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

function Square(props){

	return (
		<button 
			className="square" 
			onClick={props.onClick}
		>
		{props.value}
		</button>
	);
}

class Board extends React.Component {

	// Render a square
	renderSquare(i) {
		return (
			<Square 
				value={this.props.squares[i]}
				onClick = {() => this.props.onClick(i)}
			/>
		);
	}

	// Generate board to make squares
	// To generate square board dynamically - https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
	generateSquareBoard() {

		let table = [];
		let index = 0;	// square index
		for(let i=0; i<3; i++) {

			let children = [];
			for(let j=0; j<3; j++) {
				children.push(this.renderSquare( index ))
				index = index + 1;
			}

			table.push(<div className="board-row">{children}</div>);
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

	handleClick(i) {

		// slice() function returns shallow copy of array into new array object
		// We can udpate the array directly but to show history of move need to do this
		// https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important
		
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		// ignore click event if winner is declared or clicked square is filled
		if(calculateWinner(squares) || squares[i]) {
			return;
		}

		// assign respective value(X or O) to clicked square accordingly
		squares[i] = this.state.xIsNext ? 'X' : 'O';

		const clickedLocation = getLocationOfMove(i);
		const location = current.location.slice();
		// assign location value which will be used during displaying move history
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
	}

	// Jump to any previous move
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) === 0,
		});
	}

	// Render game component
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const location = current.location;

		const size = history.length
		const moves = history.map((step, move) => {
			const desc = move ? 
				'Go to move #'+move:
				'Go to game start';

			// Bold the currently selected item in the move list.
			// Inserted <span> deliberately below
			// If you don't inserted any html tag, it gives error, need to check why it is like this.
			const bold = ((move+1) === size) ?
				<b>{desc} - {location[move-1]}</b> :
				<span>{desc} - {location[move-1]}</span> ;

			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{bold}</button>
				</li>
			);
		});

		let status;
		if(winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{ status }</div>
					<ol>{ moves }</ol>
				</div>
			</div>
		);
	}
}

ReactDom.render(
	<Game />,
	document.getElementById('root')
);

// calculate winner
function calculateWinner(squares) {
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
			return squares[a];
		}
	}
	return null;
}

// get column and row of clicked square
function getLocationOfMove(move) {
	const location = [];
	if(move === 0) {
		location[0] = 1;
		location[1] = 1;
	} else if(move === 1) {
		location[0] = 2;
		location[1] = 1;
	} else if(move === 2) {
		location[0] = 3;
		location[1] = 1;
	} else if(move === 3) {
		location[0] = 1;
		location[1] = 2;
	} else if(move === 4) {
		location[0] = 2;
		location[1] = 2;
	} else if(move === 5) {
		location[0] = 3;
		location[1] = 2;
	} else if(move === 6) {
		location[0] = 1;
		location[1] = 3;
	} else if(move === 7) {
		location[0] = 2;
		location[1] = 3;
	} else if(move === 8) {
		location[0] = 3;
		location[1] = 3;
	}
	return location;
}