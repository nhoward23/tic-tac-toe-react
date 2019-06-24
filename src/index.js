import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function components: easy way to write components that only have
// a render method and dont have their own state
function Square(props) {
    // square renders a button. Calls Board's handleClick since that was passed as prop.
    //handleClick(i) has already set what the parameter will be when calling function
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

// parent component to square, controls squares state
// lifted Boards state to Game Component
class Board extends React.Component {

    // using properties passed from Game, renders Squares for the Board
    renderSquare(i) {
        return (
            // sets Squares value to i parameter
            // sets Squares onClick to Boards OnClick (given by Game) with i as param
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }

    // This renders a Board with 9 squares. Value is defined
    // by the parameter for renderSquare in order to keep track
    // of the squares. 
    render() {
        return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}
  
//We "lifted up state again" so Game handles Board/Square state 
class Game extends React.Component {

    // constructer initializes Game state. Must call super(props) using React Components.
    constructor(props) {
        super(props);
        // history is an array of past squares arrays, so it holds the state
        // of the game at each move.
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            // stepNumber keep track of what step we are on.
            stepNumber: 0,
            // keeps track of whose turn it is.
            xIsNext: true,  
        };
    }

    // event handler that is fired when a button (Square is clicked).
    handleClick(i) {

        // history of moves from beginning to next step.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // the current move 
        const current = history[history.length-1];
        // create a copy of squares
        // Immutability is important
        // We can easily see when a component needs to be rerendered 
        const squares = current.squares.slice();

        // if there is a winner or button clicked was filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // change the state of square to reflect the move made
        squares[i] = this.state.xIsNext ? 'X' : '0';
        // call setState() to rerender the components.
        this.setState({
            // history is now beginnging to move just made
            history: history.concat([{
                squares: squares,
            }]),
            // step number is the length of the history
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // jumpTo(step) changes step we are at to go back in history of game
    jumpTo(step) {
        // rerender the game to reflect these steps
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // Renders the Game and its descendants: Game -> Board -> Squares
    render() {

        // get the games history.
        const history = this.state.history;
        // get the current move that is kept track by stepNumber
        const current = history[this.state.stepNumber];
        // is there a winner at this moment?
        const winner = calculateWinner(current.squares);

        // create the display of list of moves with mapping
        // map the history array to li objects.
        // step is the current item in list that is being mapped to something
        // move is the index of step 
        // moves is an array li objects
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move # ' + move : 'Go to game start';
            // need key for list objects. Helps react dynamically rerender
            return (
            <li key={move}>
                <button onClick={()=> this.jumpTo(move)}>{desc}</button>
            </li> 
            );
        });

        // if there is a winner, display it
        let status; 
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        //render board with squares and onClick as props
        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                // i is param from renderSquare(i) in Board
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  // renders a game 
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  