import React, { useState, useEffect } from "react";

const GroupChat = ({ groupName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const chatSocket = new WebSocket(
      `ws://${window.location.host}/ws/chat/${groupName}/`
    );

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      setMessages((messages) => [...messages, data]);
    };

    return () => chatSocket.close();
  }, [groupName]);

  const sendMessage = () => {
    const chatSocket = new WebSocket(
      `ws://${window.location.host}/ws/chat/${groupName}/`
    );

    chatSocket.onopen = () => {
      chatSocket.send(
        JSON.stringify({
          message: newMessage,
          username: "YourUsername", // Replace with actual username
        })
      );
    };

    setNewMessage("");
  };

  return (
    <div>
      <h2>{groupName} Chat</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <b>{message.username}</b>: {message.message}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default GroupChat;
