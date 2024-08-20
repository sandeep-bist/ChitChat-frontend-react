import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

// import "emoji-mart/css/emoji-mart.css";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

export default function MessageInput({
  inputId,
  sendJsonMessages,
  typing_user_id,
  chat_user_id,
}) {
  const typingTimeoutRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  // const [message, setMessage] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [message_typing, setMessage_typing] = useState("");
  const [emojiPickerOpen, setEmojiPicker] = useState(false);

  // const token = document.cookie
  //   .split("; ")
  //   .find((row) => row.startsWith("token="))
  //   .split("=")[1];
  // const socket = new WebSocket(
  //   `ws://127.0.0.1:8000/ws/chat/${chat_user_id}/?token=${token}`
  // );
  // useEffect(() => {
  //   // window.scrollTo("#inputId");
  //   // Find the scrollable container
  //   const scrollableContainer = document.getElementById("inputId");
  //   if (scrollableContainer) {
  //     // Scroll to the bottom
  //     scrollableContainer.scroll = scrollableContainer.scrollHeight;
  //   }
  // }, []);

  // useEffect(() => {
  //   socket.onmessage = function (e) {
  //     const data = JSON.parse(e.data);
  //     console.log(data, "----------asd-asdas-d--sa-d-as-");
  //     if (data.type === "chat_message") {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { username: data.username, message: data.message },
  //       ]);
  //     } else if (data.type === "typing_status") {
  //       setTypingUsers((prevTypingUsers) => ({
  //         ...prevTypingUsers,
  //         [data.username]: data.is_typing,
  //       }));
  //     }
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, [socket]);

  // const { readyState, sendJsonMessage } = useWebSocket(
  //   `ws://127.0.0.1:8000/ws/chat/${chat_user_id}/?token=${token}`,
  //   {
  //     onOpen: () => {
  //       console.log("Connected!");
  //     },
  //     onClose: () => {
  //       console.log("Disconnected!");
  //     },

  //     onMessage: (e) => {
  //       console.log(
  //         "on messagddddddddddddddddddde recievedd----------",
  //         JSON.parse(e.data)
  //       );
  //       const data = JSON.parse(e.data);
  //       console.log(data, "----------asd-asdas-d--sa-d-as-");
  //       if (data.type === "chat_message") {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           { username: data.username, message: data.message },
  //         ]);
  //       } else if (data.type === "typing_status") {
  //         setTypingUsers((prevTypingUsers) => ({
  //           ...prevTypingUsers,
  //           [data.username]: data.is_typing,
  //         }));
  //       }
  //     },
  //     // sendJsonMessage:(e) =>{
  //     //   console.log(e);

  //     // }parsed_message_data
  //   }
  // );
  // const sendUserJsonMessage = (user_message) => {
  //   sendJsonMessage(user_message);

  //   // userMessagesList.push({message:user_message,sender:true,sender_id:user_id,reciever_id:selectedUserId})
  // };
  const handleInputChange = (event) => {
    setEmojiPicker(false);
    setMessage_typing("send_chat");
    setInputValue(event.target.value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Send "typing" event
    sendJsonMessages(false, {
      type: "typing",
      id: chat_user_id,
      typing_user_id: typing_user_id,
      reciever_id: chat_user_id,
    });

    typingTimeoutRef.current = setTimeout(() => {
      // Send "stop_typing" event
      sendJsonMessages(false, {
        type: "stop_typing",
        id: chat_user_id,
        typing_user_id: typing_user_id,
      });
    }, 3000); // Stop typing after 3 seconds of inactivity
  };

  const addEmoji = (e) => {
    console.log("addEmoji----------", e);
    let { emoji } = e;
    setInputValue((prev) => prev + emoji);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.length > 0) {
      sendJsonMessages(true, inputValue);
      setInputValue("");
      setMessage_typing("");
    }
  };
  return (
    <div className="">
      <span>
        <EmojiPicker
          open={emojiPickerOpen}
          onEmojiClick={addEmoji}
          Theme="auto"
          lazyLoadEmojis={true}
        />
      </span>
      <form onSubmit={handleSendMessage} className="message-input">
        <FaSmile
          className="icon-smiley"
          onClick={() => setEmojiPicker((prev) => !prev)}
        />
        <textarea
          id={inputId}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <button className={`${message_typing}`} type="submit">
          {" "}
          Send
        </button>
      </form>
    </div>
  );
}
