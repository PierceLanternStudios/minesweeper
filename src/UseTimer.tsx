import { State, Action } from "./UseAppState";
import React from "react";

export default function useTimer(
  state: State,
  dispatch: React.Dispatch<Action>
) {
  const intervalRef = React.useRef<NodeJS.Timer | null>(null);

  return React.useEffect(() => {
    if (state.timerOn) {
      intervalRef.current = setInterval(
        () => dispatch({ type: "uptick-timer" }),
        1000
      );
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [dispatch, state.timerOn]);
}
