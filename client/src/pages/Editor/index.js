import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import styles from "./Editor.module.scss";
import { Controlled as CodeMirror } from "react-codemirror2";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SERVER_URL } from "../../config";

import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

const Editor = () => {
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [codeContent, setCodeContent] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [languageCode, setLanguageCode] = useState("nodejs");
  let navigate = useNavigate();

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("code-typed", (data) => {
      setCodeContent(data);
    });
    socket.on("retrieve-data", (data) => setCodeContent(data));
    return () => {
      socket.emit("leave-room", roomId);
    };
  }, [socket, roomId]);

  const handleChange = (val) => {
    setCodeContent(val);
    socket.emit("code-typed", val);
  };
  const executeCode = async () => {
    try {
      setIsLoading(true);
      let res = await axios.post(`${SERVER_URL}/execute`, {
        code: codeContent,
        language_code: languageCode,
      });
      if (res.data) {
        if (res.data.type === "error") {
          setIsError(true);
          setConsoleOutput(JSON.stringify(res.data.data) || "");
        } else {
          setIsError(false);
          let consoleOutputRaw = JSON.stringify(res.data.data) || "";
          consoleOutputRaw.replace(/(\r\n|\r|"|\\n)/gm, "");
          console.log({ consoleOutputRaw });
          setConsoleOutput(consoleOutputRaw);
          // consoleOutput.replace(/(\r\n|\r|"|\\n)/gm, "")
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.invite_text}>
        <CopyToClipboard text={roomId}>
          <button className={styles.roomId_btn}>
            Copy this coderoom's ID{" "}
            <i className="fa fa-copy" aria-hidden="true"></i>
          </button>
        </CopyToClipboard>
        <div>
          <select
            className={styles.picker}
            onChange={(e) => setLanguageCode(e.target.value)}
            defaultValue={"nodejs"}
          >
            <option value={"nodejs"}>JavaScript</option>
            <option value={"python2"}>Python 2</option>
            <option value={"python3"}>Python 3</option>
            <option value={"php"}>PHP</option>
          </select>
          <button onClick={() => navigate("/")} className={styles.exit_btn}>
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div className={styles.editor_section}>
        <CodeMirror
          value={codeContent}
          options={{
            lineWrapping: true,
            lint: true,
            mode: "javascript",
            lineNumbers: true,
            theme: "material",
          }}
          onBeforeChange={(editor, data, value) => {
            handleChange(value);
          }}
        />
      </div>
      <div className={styles.output_section}>
        <button className={styles.execute_btn} onClick={executeCode}>
          <i className="fa fa-play" style={{ color: "#FFFFFF" }}></i> Run
        </button>

        {isLoading ? (
          <div className={styles.loader_container}>
            <div className={styles.loader} />
          </div>
        ) : (
          <div
            className={
              !isError ? styles.console_output : styles.console_output_error
            }
            dangerouslySetInnerHTML={{
              __html: consoleOutput
                .replace(/(\\n)/gm, "<br />")
                .replace(/(")/gm, ""),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
