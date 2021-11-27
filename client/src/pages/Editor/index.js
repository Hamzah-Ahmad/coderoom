import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/socket'
import { useParams } from 'react-router'
import axios from "axios"
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const Editor = () => {
    const socket = useContext(SocketContext)
    const { roomId } = useParams();
    const [codeContent, setCodeContent] = useState("")
    const [consoleOutput, setConsoleOutput] = useState("")

    useEffect(() => {
        socket.emit("join-room", roomId)
        socket.on('code-typed', (data) => setCodeContent(data))
        socket.on('retrieve-data', (data) => setCodeContent(data))

        return () => {
            socket.emit("leave-room", roomId)
        }
    }, [socket, roomId])

    const handleChange = (val) => {
        socket.emit("code-typed", val)
    }
    const executeCode = async () => {
        try {
            console.log(codeContent)
            let res = await axios.post("http://localhost:5000/execute", { code: codeContent.replace(/(\r\n|\n|\r)/gm, " ") })
            if(res.data){
                console.log(res.data)
                setConsoleOutput(JSON.stringify(res.data.data))
            }
        } catch (err) {
            console.log(err)
        }
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
            <button onClick={executeCode}>Execute</button>
            <div>Console Output: {consoleOutput.replace(/("|\\n)/gm, "") }</div>
        </div>
    )
}

export default Editor
