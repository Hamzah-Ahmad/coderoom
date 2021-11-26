import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"

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
        <div>
            <h1>Lobby</h1>
            <button onClick={createRoom}>Make a room</button>
            <div>
                <input type="text" onChange={handleIdInput} />
                <button onClick={joinExistingRoom}>Join Room</button>
            </div>
        </div>
    )
}

export default Lobby
