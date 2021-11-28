import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
import styles from "./Lobby.module.scss"

const Lobby = () => {
    let navigate = useNavigate();
    const [roomIdInput, setRoomIdInput] = useState("")
    const navigateToEditor = (roomId) => {
        navigate(`/editor/${roomId}`)
    }
    const createRoom = () => {
        const newRoom = uuidv4();
        navigateToEditor(newRoom)
    }
    const joinExistingRoom = () => {
        navigateToEditor(roomIdInput)
    }
    const handleIdInput = (e) => {
        setRoomIdInput(e.target.value)
    }
    return (
        <div className={styles.container}>
            <div>
                <button onClick={createRoom} className={styles.make_room_btn}>Make a room</button>
                <div className={styles.cta_section}>
                    <input type="text" onChange={handleIdInput} className={styles.room_input} />
                    <button onClick={joinExistingRoom} className={styles.join_room_btn}>Join Room</button>
                </div>
            </div>
            <div>Remaining</div>
        </div>
    )
}

export default Lobby
