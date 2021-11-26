import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/socket'
import { useParams } from 'react-router'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const Editor = () => {
    const socket = useContext(SocketContext)
    const {roomId} = useParams();
    const [codeContent, setCodeContent] = useState("")

    useEffect(() => {
        socket.emit("join-room", roomId)
        socket.on('code-typed', (data) => setCodeContent(data))
        return () => {
            socket.emit("leave-room", roomId)
        }
    }, [socket, roomId])

    const handleChange = (val) => {
        socket.emit("code-typed", val)
    }
    return (
        <div>
            <div>Editor</div>
           {/* <textarea  onChange={handleChange} value={codeContent}>
               
           </textarea> */}
           <CodeMirror
                value={codeContent}
                options={{
                    lineWrapping: true,
                    lint: true,
                    mode: "javascript",
                    lineNumbers: true,
                    theme: "material"
                }}
                onBeforeChange={(editor, data, value) => {
                    handleChange(value)
                }}
            />
        </div>
    )
}

export default Editor
