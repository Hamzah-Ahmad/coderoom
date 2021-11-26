import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/socket'
import { useParams } from 'react-router'

const Editor = () => {
    const socket = useContext(SocketContext)
    const {roomId} = useParams();
    const [codeContent, setCodeContent] = useState("")

    useEffect(() => {
        socket.emit("join-room", roomId)
        socket.on('code-typed', (data) => setCodeContent(data))
    }, [socket, roomId])
    
    const handleChange = (e) => {
        socket.emit("code-typed", e.target.value)
    }
    return (
        <div>
            <div>Editor</div>
           <textarea  onChange={handleChange} value={codeContent}>
               
           </textarea>
        </div>
    )
}

export default Editor
