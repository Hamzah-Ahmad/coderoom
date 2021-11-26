import Editor from '../components/Editor';
import './App.css';
import SocketProvider from "../context/socket"
function App() {
  return (
    <SocketProvider>
      <div className="App">
        <Editor />
      </div>
    </SocketProvider>
  );
}

export default App;
