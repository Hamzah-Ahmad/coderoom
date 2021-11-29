import { createContext } from "react";
import {io} from "socket.io-client";
import {SERVER_URL} from "../config"
export const socket = io.connect(SERVER_URL);
export const SocketContext = createContext(socket);

const SocketProvider = ({children}) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider