import React, { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import music from "./notification.wav";

// connection with socket in backend
const socket = io.connect("http://localhost:2000");
const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const notification = new Audio(music);
  const join_chat = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      notification.play();
    }
  };
  return (
    <>
      {!showChat && (
        <div className="join_room">
          <h1>Join Chat Here</h1>
          <input
            type="text"
            placeholder="Enter Name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Room code..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={join_chat} className="btn">
            Join
          </button>
        </div>
      )}

      {showChat && <Chat socket={socket} username={username} room={room} />}
    </>
  );
};

export default App;
