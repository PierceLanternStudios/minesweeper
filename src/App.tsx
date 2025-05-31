import "./App.css";
import useAppState from "./UseAppState";
import useLoadBoard from "./useLoadBoard";

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
