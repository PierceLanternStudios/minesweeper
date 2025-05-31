import "./App.css";
import useAppState from "./UseAppState";
import useLoadBoard from "./useLoadBoard";

/**
 * App
 *
 * Main driver for the Minesweeper game! This handles the
 * highest level game logic and the markdown to display
 * for each section of the game.
 */
function App() {
  const [state, dispatch] = useAppState();
  useLoadBoard(dispatch, 10);
  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
