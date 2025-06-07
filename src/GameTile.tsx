import { Dispatch } from "react";
import { Action } from "./UseAppState";
import { Board } from "./Board";

/**
 * gameTileButton
 *
 * A function that generates a button for each tile in the game board.
 * This button will handle the click events to reveal or flag tiles
 * based on the current game state.
 * @param dispatch    The dispatch function called to update the game state
 *                    when a button is clicked.
 * @param board       The current board state to use when rendering the
 *                    buttons.
 * @param row         The row index of the tile in the board.
 * @param col         The column index of the tile in the board.
 * @returns           A button component for a specific tile in the game board
 * *                  that handles click events to reveal or flag tiles.
 */
export default function gameTileButton(
  dispatch: Dispatch<Action>,
  board: Board,
  row: number,
  col: number
) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.nativeEvent.button === 0)
      dispatch({ type: "reveal-tile", row: row, col: col });
    else if (e.nativeEvent.button === 2) {
      e.preventDefault();
      dispatch({ type: "flag-tile", row: row, col: col });
    }
  };

  return (
    <button onClick={handleClick} onContextMenu={handleClick}>
      {renderTile(board, row, col)}
    </button>
  );
}

/**
 * renderTile
 *
 * A function that generates the display value for a tile in the game board.
 * It checks if the tile has been revealed, flagged, or contains a mine.
 * @param board       The current board state to use when rendering the tile.
 * @param row         The row index of the tile in the board.
 * @param col         The column index of the tile in the board.
 * @returns           A string representing the display value of the tile.
 */
function renderTile(board: Board, row: number, col: number): string {
  if (board.display[row][col] !== -1) return board.display[row][col].toString();
  if (board.flags[row][col]) return "🚩";
  // if (board.mines[row][col]) return "💣"; // DEBUG: REMOVE THIS EVENTUALLY
  return "__";
}
