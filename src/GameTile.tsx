import { Dispatch } from "react";
import { Action } from "./UseAppState";
import { Board } from "./Board";
import { render } from "@testing-library/react";

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

function renderTile(board: Board, row: number, col: number): string {
  if (board.display[row][col] !== -1) return board.display[row][col].toString();
  if (board.flags[row][col]) return "🚩";
  // if (board.mines[row][col]) return "💣"; // DEBUG: REMOVE THIS EVENTUALLY
  return "__";
}
