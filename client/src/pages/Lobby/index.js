import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
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
        if(!roomIdInput){
            toast.error('Please enter a room ID', {duration: 2000})
            return;
        }
        navigateToEditor(roomIdInput)
    }
    const handleIdInput = (e) => {
        setRoomIdInput(e.target.value)
    }
    return (
        <div className={styles.container}>
            <Toaster />
            <div className={styles.header}>
                CodeRooms
            </div>
            <div className={styles.subheader}>
                Instantly create live collaboration coding rooms without the hassles of signing up or logging in!
            </div>
            <div className={styles.cta_section}>
                <button onClick={createRoom} className={styles.make_room_btn}>Make a room</button>
                <div className={styles.choice_text}>Or Join An Existing Room</div>
                <div className={styles.input_section}>
                    <input type="text" onChange={handleIdInput} className={styles.room_input} placeholder="Enter room ID"/>
                    <button onClick={joinExistingRoom} className={styles.join_room_btn}>Join Room</button>
                </div>
            </div>
        </div>
    )
}

export default Lobby
