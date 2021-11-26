import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/socket'

const Editor = () => {
    const socket = useContext(SocketContext)
    const [codeContent, setCodeContent] = useState("")
    useEffect(() => {
        socket.on('code-typed', (data) => setCodeContent(data))

    }, [socket])
    const handleChange = (e) => {
        // setCodeContent(e.target.value)
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
