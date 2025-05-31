import { useEffect, Dispatch } from "react";
import { Board } from "./Board";
import { Action } from "./UseAppState";

/**
 * useLoadBoard
 *
 * A custom react hook that generates a new board and, when completeted,
 * calls our state dispatch to load the new board into state.
 * @param dispatch    The dispatch function used to load the board into
 *                    state. Note that this hook must be run after useAppState()
 * @param size        An integer representing the number of tiles to generate
 *                    on each side of the board.
 * @returns           A hook that can be called to generate a board in state
 *                    from within App.tsx
 */
export default function useLoadBoard(dispatch: Dispatch<Action>, size: number) {
  return useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "load-board", board: generateBoard(size) });
    }, 500);
  }, [dispatch]);
}

/**
 * generateBoard
 *
 * Generates a new, unsolved, random board! Can make a board of any size.
 * @param size    A number representing the number of tiles on each side of
 *                the board to generate from
 * @returns       A new board object
 */
function generateBoard(size: number): Board {
  const BOMB_FREQUENCY = 0.25;
  const board: Board = {
    mines: Array.from({ length: size }, () =>
      Array(size)
        .fill(false)
        .map(() => Math.random() < BOMB_FREQUENCY)
    ),
    display: Array.from({ length: size }, () => Array(size).fill(-1)),
  };

  return board;
}
