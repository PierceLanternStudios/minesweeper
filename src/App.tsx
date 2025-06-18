import "./App.css";
import { Board } from "./Board";
import gameTileButton from "./GameTile";
import useAppState, { Action, State } from "./UseAppState";
import useLoadBoard from "./useLoadBoard";
import UseTimer from "./UseTimer";
import { formatTime } from "./Utilities";
import BoardCSS from "./Board.module.css";
import SplashCSS from "./Splash.module.css";
import GameplayCSS from "./Gameplay.module.css";
import PostgameCSS from "./Postgame.module.css";
import CheckboxCSS from "./Checkbox.module.css";
import React from "react";

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
            {settingsModule(state, dispatch)}
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
        <div className={PostgameCSS.container}>
          <div className={PostgameCSS.stack}>
            <h1>{state.playerWin ? "You Won!" : "You Lost!"}</h1>
            <div className={PostgameCSS.row}>
              <p>
                Time: <strong>{formatTime(state.timerVal)}</strong>
              </p>
              <p
                style={{
                  marginLeft: "auto",
                  alignItems: "flex-end",
                }}
              >
                Seed: <strong>{state.seed}</strong>
              </p>
            </div>
            <div className={PostgameCSS.row}>
              <button
                className={PostgameCSS.button}
                onClick={() => dispatch({ type: "start-game" })}
              >
                Restart
              </button>
              <button
                className={PostgameCSS.button}
                onClick={() =>
                  dispatch({
                    type: "set-seed",
                    seed: Math.trunc(Math.random() * 10 ** 6),
                  })
                }
              >
                Randomize Board
              </button>
            </div>

            {settingsModule(state, dispatch)}
          </div>
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

/**
 * settingsModule
 *
 * A helper function that returns the settings module box, to clean up code
 * in App().
 * @param state       A reference to the main game state.
 * @param dispatch    A reference to the associated dispatch function, for
 *                    use in changing the state.
 * @returns           styled markdown for the settings collection.
 * @note              This section relies on the style rules from
 *                    Splash.module.css.
 *
 */
function settingsModule(state: State, dispatch: React.Dispatch<Action>) {
  return (
    <div className={SplashCSS.settings}>
      <div className={SplashCSS.col}>
        <div className={SplashCSS.row} style={{ columnGap: "100px" }}>
          Board Size:
          <input
            type="number"
            value={state.boardSize}
            style={{ marginLeft: "auto" }}
            max={100}
            onChange={(newSize) => {
              dispatch({
                type: "set-size",
                size: Math.min(Number(newSize.target.value), 100),
              });
            }}
          />
        </div>
        <div className={SplashCSS.row} style={{ columnGap: "100px" }}>
          Seed:
          <input
            type="text"
            value={state.seed}
            style={{ marginLeft: "auto" }}
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
        </div>
        <div className={SplashCSS.row} style={{ columnGap: "100px" }}>
          Preserve Progress:
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {checkbox(state, dispatch)}
          </span>
        </div>
      </div>
    </div>
  );
}

function checkbox(state: State, dispatch: React.Dispatch<Action>) {
  return (
    <label className={CheckboxCSS.checkbox}>
      <input
        type="checkbox"
        style={{
          marginLeft: "auto",
          alignSelf: "center",
          alignItems: "center",
        }}
        checked={state.preserveProgress}
        onChange={() => {
          dispatch({
            type: "set-preserve-progress",
            shouldPreserve: !state.preserveProgress,
          });
        }}
      />
      <span className={CheckboxCSS.checkmark}></span>
    </label>
  );
}
export default App;
