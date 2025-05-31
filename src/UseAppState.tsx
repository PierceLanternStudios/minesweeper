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

function getInitialState(): State {
  return { phase: "pre-game", board: null };
}
