import "./App.css";
import { Board } from "./Board";
import gameTileButton from "./GameTile";
import useAppState, { Action } from "./UseAppState";
import useLoadBoard from "./useLoadBoard";
import BoardCSS from "./Board.module.css";
import reportWebVitals from "./reportWebVitals";

/**
 * App
 *
 * Main driver for the Minesweeper game! This handles the
 * highest level game logic and the markdown to display
 * for each section of the game.
 */
function App() {
  const [state, dispatch] = useAppState();
  useLoadBoard(state, dispatch, 2);

  switch (state.phase) {
    case "pre-game":
      return (
        <div>
          <button
            onClick={() => {
              dispatch({ type: "start-game" });
            }}
          >
            Start Game!
          </button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    case "in-game":
      return (
        <div>
          <div>{renderBoard(state.board, dispatch)}</div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    case "post-game":
      return (
        <div>
          <h3>{state.playerWin ? "You Won!" : "You Lost!"}</h3>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Restart
          </button>
          <button
            onClick={() => dispatch({ type: "set-seed", seed: Math.random() })}
          >
            Randomize Board
          </button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
  }
}

/**
 * renderBoard
 *
 * A helper function to render an array of buttons as the board based on
 * the current state.
 *
 * @param board       The board to render as buttons.
 * @param dispatch    The dispatch function used whenever a button is
 *                    pressed to handle the changes in state.
 * @returns           A div component containing the array of buttons
 *                    to display as the board.
 */
function renderBoard(board: Board, dispatch: React.Dispatch<Action>) {
  return (
    <div
      className={BoardCSS.board}
      style={{
        gridTemplateColumns: "repeat(" + board.display.length + ", 50px)",
      }}
    >
      {board.display.map((row, rowIdx) => (
        <div className={BoardCSS.board_row} key={rowIdx}>
          {row.map((col, colIdx) =>
            gameTileButton(dispatch, board, rowIdx, colIdx)
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
