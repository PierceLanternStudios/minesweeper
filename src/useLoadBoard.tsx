import { useEffect, Dispatch } from "react";
import { Board } from "./Board";
import { State, Action } from "./UseAppState";
import seedrandom from "seedrandom";

const BOMB_FREQUENCY = 0.2;

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
export default function useLoadBoard(
  state: State,
  dispatch: Dispatch<Action>,
  size: number
) {
  return useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "load-board", board: generateBoard(size, state.seed) });
    }, 500);
  }, [dispatch, state.seed]);
}

/**
 * generateBoard
 *
 * Generates a new, unsolved, random board! Can make a board of any size.
 * @param size    A number representing the number of tiles on each side of
 *                the board to generate from
 * @returns       A new board object
 */
function generateBoard(size: number, seed: number): Board {
  const rng = seedrandom(seed.toString());

  const board: Board = {
    mines: Array.from({ length: size }, () =>
      Array(size)
        .fill(false)
        .map(() => rng() < BOMB_FREQUENCY)
    ),
    display: Array.from({ length: size }, () => Array(size).fill(-1)),
    flags: Array.from({ length: size }, () => Array(size).fill(false)),
  };

  return board;
}
