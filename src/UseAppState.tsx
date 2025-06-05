import React, { Dispatch } from "react";
import { Board } from "./Board";

export type State =
  | {
      phase: "pre-game";
      seed: number;
      board: Board | null;
    }
  | {
      phase: "in-game";
      seed: number;
      board: Board;
    }
  | {
      phase: "post-game";
      seed: number;
      board: Board;
    };

export type Action =
  | {
      type: "start-game";
    }
  | {
      type: "load-board";
      board: Board;
    }
  | {
      type: "reveal-tile";
      row: number;
      col: number;
    }
  | {
      type: "set-seed";
      seed: number;
    };

/**
 * useAppState
 *
 * A custom react hook designed to handle creation of the app state.
 * This will initialize state to the value returned by getInitialState().
 * @returns A react hook that can be called within App.tsx to generate
 *          state.
 * @note    This hook must be called before any other hooks that rely
 *          on the existence of state!
 */
export default function useAppState(): [State, Dispatch<Action>] {
  return React.useReducer(reducer, null, getInitialState);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    /*
        Start game case. 
        No-Ops if:
            - Board is not loaded

        Otherwise:
            - Changes the game to in-game state
    */
    case "start-game":
      // no-op if board is not loaded:
      if (state.board === null) return state;
      return { ...state, phase: "in-game", board: state.board };

    /*
    Start game case. 
    No-Ops if:
        - never

    Otherwise:
        - Changes the state wordpack to the passed data.
    */
    case "load-board":
      return { ...state, board: action.board };

    /*
    Reveal tile case.
    No-Ops if:
      - Phase not in game

      Otherwise:
        - determines what should happen if a tile is clicked.
    */
    case "reveal-tile":
      if (state.phase !== "in-game") return state;
      //check if player lost the game
      else if (state.board.mines[action.row][action.col])
        return { ...state, phase: "post-game" };
      // otherwise reveal the tile:
      else
        return {
          ...state,
          board: revealTile(state.board, action.row, action.col),
        };

    case "set-seed": {
      return { ...state, seed: action.seed };
    }
  }
}

/**
 * getInitialState
 *
 * A function that returns the default value of the game state,
 * for use during initialization of the state.
 * @returns     The default value of state.
 */
function getInitialState(): State {
  return { phase: "pre-game", seed: Math.random(), board: null };
}

/**
 * revealTile
 *
 * Used to reveal a tile when it has been clicked and is determined to not
 * be a bomb. Handles the logic of determining what number to show, and
 * then returns the most up-to-date board (updating the display array).
 * @param currentBoard    Takes in the current board to use when determining
 *                        what number to show and what display information
 *                        has already been revealed
 * @param row             The row index of the clicked-on square
 * @param col             The column index of the clicked-on square
 * @param mines           An optional parameter containing the number of mines
 *                        to display. This parameter should only be set if the
 *                        correct display number has already been calculated
 *                        and cached, to prevent recalculation here.
 * @returns               A new board object with the most up-to-date display
 *                        information.
 * @note                  Note that this assumes the player clicked a square
 *                        that is not a bomb! The check for is-a-bomb must
 *                        happen before this.
 */
function revealTile(
  currentBoard: Board,
  row: number,
  col: number,
  mines: number = -1
): Board {
  // count mines near revealed tile:
  if (mines === -1) mines = calculateTile(currentBoard, row, col);

  //update relevant square + propogate zeros:
  currentBoard.display[row][col] = mines;
  if (mines === 0) propogateZeros(currentBoard, row, col);
  return currentBoard;
}

/**
 * calculateTile
 *
 * A helper function that is used to count the correct display number
 * for a given tile. Returns an integer 0-8 if the tile indices are valid,
 * or -1 if they are out of bounds.
 * @param currentBoard  A reference to the current board.
 * @param row           The row index to calculate.
 * @param col           The column index to calculate.
 * @returns             The number of mines surrounding that tile, or -1
 *                      if the provided indices are out-of-bounds.
 */
function calculateTile(currentBoard: Board, row: number, col: number): number {
  //make sure row/col are in bounds:
  if (
    row >= currentBoard.display.length ||
    row < 0 ||
    col >= currentBoard.display[0].length ||
    col < 0
  )
    return -1;

  // otherwise, perform calculation as normal:
  // count mines near revealed tile:
  let localMines = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (currentBoard.mines[row + i]?.[col + j] ?? false) localMines++;
    }
  }
  return localMines;
}

/**
 * propogateZeros
 *
 * Function that reveals all tiles surrounding a tile of value 0.
 * Does this via the "revealTile" function, which will recursively
 * call this function again on any further revealed zeros, propogating
 * across the entire zero clump.
 * @param currentBoard  A reference to the current board to update the
 *                      display of.
 * @param row           The row index of the zero tile to propogate
 *                      from.
 * @param col           The column index of the zero tile to propogate
 *                      from.
 */
function propogateZeros(currentBoard: Board, row: number, col: number) {
  // double check that the pointed-out square is a zero:
  if (currentBoard.display[row][col] !== 0) return;

  // otherwise, reveal all the adjacent squares:
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if ((currentBoard.display[row + i]?.[col + j] ?? false) === -1)
        revealTile(currentBoard, row + i, col + j);
    }
  }
}
