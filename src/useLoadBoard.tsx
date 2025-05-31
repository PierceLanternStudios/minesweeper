import { useEffect, Dispatch } from "react";
import { Board } from "./Board";
import { Action } from "./UseAppState";

export default function useLoadBoard(dispatch: Dispatch<Action>, size: number) {
  return useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "load-board", board: generateBoard(size) });
    }, 500);
  }, [dispatch]);
}

function generateBoard(size: number): Board {
  const BOMB_FREQUENCY = 0.25;
  const board: Board = {
    mines: Array.from({ length: size }, () =>
      Array(size).fill(Math.random() < BOMB_FREQUENCY)
    ),
    display: Array.from({ length: size }, () => Array(size).fill(-1)),
  };
  return board;
}
