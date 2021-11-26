import Editor from '../pages/Editor';
import Lobby from '../pages/Lobby';
import './App.css';
import SocketProvider from "../context/socket"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import NotFound from '../pages/NotFound';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />}/>
          <Route path="/editor/:roomId" element={<Editor />}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
      <div className="App">
      </div>
    </SocketProvider>
  );
}

export default App;
