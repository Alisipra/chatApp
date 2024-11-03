import React, { useEffect, useState } from "react";
import msg from "./tone.mp3";
function Chat({ socket, username, room }) {
  const [currentmessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const notification = new Audio(msg);
  const sendMessage = async () => {
    if (currentmessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentmessage,
        time:
          (new Date(Date.now()).getHours() % 12) +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      // hitt its backend route
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      notification.play();
    }
  };
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);
  return (
    <>
      <div className="sendContainer">
        <h1>Hello Mr.{username}</h1>
        <div className="innercontainer">
          {messageList.map((data) => {
            return (
              <>
                <div
                  className="container"
                  id={username == data.author ? "you" : "other"}
                >
                  <div className="chat_msgs">
                    <p className="author">{data.author}</p>

                    <span id={username == data.author ? "y" : "p"}>
                      {data.message}
                    </span>

                    <p>{data.time}</p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div id="messageSpace">
          <input
            type="text"
            placeholder="Write Message"
            value={currentmessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
    </>
  );
}

export default Chat;
