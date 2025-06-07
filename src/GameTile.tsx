import { Dispatch } from "react";
import { Action } from "./UseAppState";
import { Board } from "./Board";

export default function gameTileButton(
  dispatch: Dispatch<Action>,
  board: Board,
  row: number,
  col: number
) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.nativeEvent.button === 0)
      dispatch({ type: "reveal-tile", row: row, col: col });
    else if (e.nativeEvent.button === 2)
      dispatch({ type: "flag-tile", row: row, col: col });
  };

  return (
    <button onClick={handleClick}>
      {board.mines[row][col]
        ? "#"
        : board.display[row][col] === -1
        ? " "
        : board.display[row][col]}
    </button>
  );
}
