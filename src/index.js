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
  class Board extends React.Component {

    // constructor to initialize the state of Board
    constructor(props) {
        // always have to call super using React constructors 
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }; 
    }

    // when a square is clicked this function is fired.
    handleClick(i) {
        // create a copy of squares
        // Immutability is important
        // we can easily see when a component needs to be rerendered 
        const squares = this.state.squares.slice();

        // if there is a winner or button clicked was filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // changes Board's state to this new squares array
        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i) {
      return (
          // uses function Square to return a square
          // passes props value and onClick where onClick is a function (event handling)
        <Square 
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
        />
       );
    }
  
    // This Board renders 9 squares. 
    render() {
      // X, O, or null 
      const winner = calculateWinner(this.state.squares);
      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      // renders Squares 
      return (
        <div>
          <div className="status">{status}</div>
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
  
  class Game extends React.Component {
    // this Game renders a Board. 
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
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
  
  