import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/socket'
import { useParams, useNavigate } from 'react-router'
import axios from "axios"
import styles from "./Editor.module.scss"
import { Controlled as CodeMirror } from 'react-codemirror2'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const Editor = () => {
    const socket = useContext(SocketContext)
    const { roomId } = useParams();
    const [codeContent, setCodeContent] = useState("")
    const [consoleOutput, setConsoleOutput] = useState("")
    const [isError, setIsError] = useState(false)
    let navigate = useNavigate();


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
            if (res.data) {
                console.log(res)
                if (res.data.type === "error") {
                    setIsError(true)
                    setConsoleOutput(JSON.stringify(res.data.data))
                } else {
                    setIsError(false)
                    setConsoleOutput(JSON.stringify(res.data.data))
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.invite_text}>
                <CopyToClipboard text={roomId}>
                    <button className={styles.roomId_btn}>Copy this coderoom's ID <i class="fa fa-copy" aria-hidden="true"></i></button>
                </CopyToClipboard>
                <button onClick={() => navigate("/")} className={styles.exit_btn}><i class="fa fa-sign-out" aria-hidden="true"></i></button>
            </div>
            <div className={styles.editor_section}>
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
            <div className={styles.output_section}>
                <button className={styles.execute_btn} onClick={executeCode}>
                    <i className="fa fa-play" style={{ color: "#FFFFFF" }}></i> Run
                </button>
                <div className={!isError ? styles.console_output : styles.console_output_error}>{consoleOutput.replace(/(\r\n|\r|"|\\n)/gm, "")}</div>
            </div>
        </div>
    )
}

export default Editor
