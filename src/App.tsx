import "./App.css";
import { Board } from "./Board";
import gameTileButton from "./GameTile";
import useAppState, { Action } from "./UseAppState";
import useLoadBoard from "./useLoadBoard";
import BoardCSS from "./Board.module.css";
import SplashCSS from "./Splash.module.css";
import GameplayCSS from "./Gameplay.module.css";
import UseTimer from "./UseTimer";
import { formatTime } from "./Utilities";

/**
 * App
 *
 * Main driver for the Minesweeper game! This handles the
 * highest level game logic and the markdown to display
 * for each section of the game.
 */
function App() {
  const [state, dispatch] = useAppState();
  useLoadBoard(state, dispatch);
  UseTimer(state, dispatch);

  switch (state.phase) {
    case "pre-game":
      return (
        <div className={SplashCSS.container}>
          <div className={SplashCSS.controls}>
            <button
              className={SplashCSS.startButton}
              onClick={() => {
                dispatch({ type: "start-game" });
              }}
            >
              Start Game!
            </button>

            <div className={SplashCSS.settings}>
              <div className={SplashCSS.row} style={{ columnGap: "100px" }}>
                <div className={SplashCSS.col}>
                  <h3>Settings:</h3>
                  <strong>Board Size:</strong>
                  <strong>Seed:</strong>
                  <strong>Preserve Progress:</strong>
                </div>

                <div className={SplashCSS.col} style={{ alignItems: "end" }}>
                  <h3>Values:</h3>
                  <input
                    type="number"
                    value={state.boardSize}
                    max={100}
                    onChange={(newSize) => {
                      dispatch({
                        type: "set-size",
                        size: Math.min(Number(newSize.target.value), 100),
                      });
                    }}
                  />

                  <input
                    type="text"
                    value={state.seed}
                    maxLength={6}
                    onChange={(newSeed) => {
                      if (
                        newSeed.target.value.replace(/[^0-9]/, "") ===
                        newSeed.target.value
                      )
                        dispatch({
                          type: "set-seed",
                          seed: Number(newSeed.target.value),
                        });
                    }}
                  />

                  <input
                    type="checkbox"
                    checked={state.preserveProgress}
                    onChange={() => {
                      dispatch({
                        type: "set-preserve-progress",
                        shouldPreserve: !state.preserveProgress,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "in-game":
      return (
        <div className={GameplayCSS.container}>
          <div className={GameplayCSS.stack}>
            <div className={GameplayCSS.top_stats}>
              <strong style={{ marginRight: "auto" }}>Minesweeper</strong>
              <strong style={{ marginLeft: "auto" }}>
                Time: {formatTime(state.timerVal)}
              </strong>
            </div>
            <div>{renderBoard(state.board, dispatch)}</div>
            <div className={GameplayCSS.bottom}>
              Seed: {state.seed}{" "}
              <button
                className={GameplayCSS.end_button}
                onClick={() => dispatch({ type: "end-game" })}
              >
                End Game
              </button>
            </div>
          </div>
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
            onClick={() =>
              dispatch({
                type: "set-seed",
                seed: Math.trunc(Math.random() * 10 ** 6),
              })
            }
          >
            Randomize Board
          </button>
          <input
            type="number"
            value={state.boardSize}
            max={100}
            onChange={(newSize) => {
              dispatch({
                type: "set-size",
                size: Math.min(Number(newSize.target.value), 100),
              });
            }}
          />
          <input
            type="text"
            value={state.seed}
            maxLength={6}
            onChange={(newSeed) => {
              if (
                newSeed.target.value.replace(/[^0-9]/, "") ===
                newSeed.target.value
              )
                dispatch({
                  type: "set-seed",
                  seed: Number(newSeed.target.value),
                });
            }}
          />
          <input
            type="checkbox"
            checked={state.preserveProgress}
            onChange={() => {
              dispatch({
                type: "set-preserve-progress",
                shouldPreserve: !state.preserveProgress,
              });
            }}
          />
          Time: {formatTime(state.timerVal)}
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
