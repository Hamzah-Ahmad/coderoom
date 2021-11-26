import { createContext } from "react";
import {io} from "socket.io-client"
export const socket = io.connect("http://localhost:5000");
export const SocketContext = createContext(socket);

const SocketProvider = ({children}) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider