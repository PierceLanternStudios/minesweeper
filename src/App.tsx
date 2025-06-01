import "./App.css";
import { Board } from "./Board";
import useAppState, { State, Action } from "./UseAppState";
import useLoadBoard from "./useLoadBoard";

/**
 * App
 *
 * Main driver for the Minesweeper game! This handles the
 * highest level game logic and the markdown to display
 * for each section of the game.
 */
function App() {
  const [state, dispatch] = useAppState();
  useLoadBoard(dispatch, 10);

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
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
  }
}

function renderBoard(board: Board, dispatch: React.Dispatch<Action>) {
  return (
    <div>
      {board.display.map((row, rowIdx) => (
        <div>
          {row.map((col, colIdx) => (
            <button
              onClick={() =>
                dispatch({ type: "reveal-tile", row: rowIdx, col: colIdx })
              }
            >
              {board.display[rowIdx][colIdx] === -1
                ? " "
                : board.display[rowIdx][colIdx]}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
