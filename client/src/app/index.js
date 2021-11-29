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
import Loader from "../components/Loader"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../config';

function App() {
  const [loadComplete, setLoadComplete] = useState(false);
  useEffect(() => {
    (async () => {
      let res = await axios.get(`${SERVER_URL}/`);
      if (res.status === 200) setLoadComplete(true)
    })()
  }, [])
  return (
    <>
      <SocketProvider>
        {
          loadComplete ? <BrowserRouter>
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/editor/:roomId" element={<Editor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
            :
            <Loader />
        }
      </SocketProvider>
    </>
  );
}

export default App;
