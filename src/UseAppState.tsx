import React, { Dispatch } from "react";
import { Board } from "./Board";

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
