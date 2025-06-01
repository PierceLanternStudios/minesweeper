import React, { Dispatch } from "react";
import { Board } from "./Board";
import { stripVTControlCharacters } from "util";

export type State =
  | {
      phase: "pre-game";
      board: Board | null;
    }
  | {
      phase: "in-game";
      board: Board;
    }
  | {
      phase: "post-game";
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
  return { phase: "pre-game", board: null };
}

function revealTile(currentBoard: Board, row: number, col: number): Board {
  // count mines near revealed tile:
  let localMines = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (currentBoard.mines[row + i][col + j] ?? false) localMines++;
    }
  }
  //update relevant square + return out
  currentBoard.display[row][col] = localMines;
  return currentBoard;
}
