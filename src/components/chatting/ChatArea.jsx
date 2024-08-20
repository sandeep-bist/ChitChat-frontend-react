import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Sidebar from "./Sidebar";
import withAuthentication from "../../utils/withAuthentication";
import axios from "axios";
import ChatDemoScreen from "./ChatDemoScreen";
import PrimarySearchAppBar from "./usermessagebar";
import { assets } from "../../assets/assets";
import ProfileDetails from "./ProfileDetails";
import GroupNavBAr from "./groups/GroupNAvBAr";
function ChatArea(props) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChatsection, SetCurrentChatsection] = useState("one_to_one");

  const [profilePage, showProfilePage] = useState(false);
  const [selectedUserId, SetSelectedUSer] = useState(null);
  const [selectedGroupId, SetSelectedGroup] = useState(null);

  const [opponentUser, SetOpponentUser] = useState("");
  const [groupOpen, SetGroupForChat] = useState(null);
  const [membersInGroup, SetmembersInGroup] = useState([]);

  const [userMessagesList, setUserMessages] = useState([]);
  const [socketUrl, setSocketUrl] = useState("");
  const [isOpponentUserTyping, setOpponentUserTyping] = useState(false);
  const [userInGroupTyping, setUserInGroupTyping] = useState({
    is_typing: false,
    userid: "",
  });
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (selectedUserId) {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
      const socketUrls = `ws://127.0.0.1:8000/ws/chat/${selectedUserId}/?token=${token}`;
      setSocketUrl(socketUrls);
      //get all mesage of selected user id

      axios
        .get(`http://127.0.0.1:8000/api/chat/${selectedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          setUserMessages(response.data.messages);
          SetOpponentUser(response.data.username);
        })
        .catch((error) => {
          console.log(error, "error========getting user list=");
        });
    }
  }, [selectedUserId]);

  useEffect(() => {
    console.log("selectedGroupId-----------", selectedGroupId);
    SetCurrentChatsection("group_section");

    if (selectedGroupId !== null) {
      SetSelectedUSer(null);
      showProfilePage(false);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    console.log("---selecteduserId--------", selectedUserId);
    SetCurrentChatsection("one_to_one");
    if (selectedUserId !== null) {
      SetSelectedGroup(null);
      showProfilePage(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    console.log("selectedGroupId-----------", selectedGroupId);
    if (selectedGroupId) {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
      const socketUrls = `ws://127.0.0.1:8000/ws/chat/group/${selectedGroupId}/?token=${token}`;
      setSocketUrl(socketUrls);
      //get all mesage of selected user id

      axios
        .get(`http://127.0.0.1:8000/api/groups/${selectedGroupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          setUserMessages(response.data.messages);
          SetGroupForChat(response.data.name);
          SetmembersInGroup(response.data.members);
        })
        .catch((error) => {
          console.log(error, "error========getting user list=");
        });
    }
  }, [selectedGroupId]);

  // console.log(socketUrl,"slecteduserid",selectedUserId)

  // const socketOnlineStatusUrl = 'ws://127.0.0.1:8000/ws/online/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmRlZXBAa3VhbnRzLmluIiwiaWQiOiIxIiwiZXhwIjoxNzE4OTU5MTk2fQ.PEHses-oWXFsyRjyC58V4BAoGgrghqhAFurrutcktx0';
  const { readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("Connected!");
    },
    onClose: () => {
      console.log("Disconnected!");
    },

    onMessage: (e) => {
      console.log(
        user_id,
        "on message recievedd----------",
        JSON.parse(e.data)
      );

      const data = JSON.parse(e.data);
      if (data.status) {
        setOnlineUsers(data.username);
        // setOnlineUsers((prev) => ({
        //   ...prev,
        //   [data.username]: data.status,
        // }));
      } else if (data.type === "chat_message") {
        let parsed_message_data = JSON.parse(e.data);
        console.log("here is a chat message======", parsed_message_data);
        let sender_id =
          user_id === parsed_message_data.id ? user_id : parsed_message_data.id;
        let reciever_id =
          user_id === parsed_message_data.id ? parsed_message_data.id : user_id;

        showNotification(parsed_message_data.message);
        userMessagesList.push({
          message: parsed_message_data.message,
          sender: user_id === parsed_message_data.id,
          sender_id: sender_id,
          reciever_id: reciever_id,
          sender_name: parsed_message_data.sender_name,
          sender_email: parsed_message_data.sender_email,
        });
      } else if (
        data.type === "typing_status" &&
        data.username.toString() === user_id
      ) {
        // if (data.is_group_message == true) {
        //   if (data.is_typing == true) {
        //     setUserInGroupTyping({ is_typing: true, userid: data.username });
        //   } else {
        //     setUserInGroupTyping({ is_typing: false, userid: "" });
        //   }
        // } else {
        if (data.is_typing == true) {
          setOpponentUserTyping(true);
        } else {
          setOpponentUserTyping(false);
        }
        // }
      } else if (
        data.type === "typing_status" &&
        data.username.toString() !== user_id
      ) {
        if (data.is_group_message == true) {
          if (data.is_typing == true) {
            setUserInGroupTyping({
              is_typing: true,
              userid: data.sender_email,
            });
          } else {
            setUserInGroupTyping({ is_typing: false, userid: "" });
          }
        }
      }
    },
    // sendJsonMessage:(e) =>{
    //   console.log(e);

    // }parsed_message_data
  });

  const sendUserJsonMessage = (custom, user_message) => {
    if (!custom) {
      sendJsonMessage(user_message);
    } else {
      sendJsonMessage({
        chat_relation: "one_to_one",
        type: "chat_message",
        message: user_message,
        id: user_id,
        reciever_id: selectedUserId,
      });
    }

    // userMessagesList.push({message:user_message,sender:true,sender_id:user_id,reciever_id:selectedUserId})
  };

  const sendInGroupJsonMessage = (custom, group_message) => {
    if (!custom) {
      sendJsonMessage(group_message);
    } else {
      sendJsonMessage({
        chat_relation: "group_message",
        type: "chat_message",

        message: group_message,
        id: user_id,
        reciever_id: selectedGroupId,
      });
    }

    // userMessagesList.push({message:user_message,sender:true,sender_id:user_id,reciever_id:selectedUserId})
  };
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const userChatScreenOpen = (user_id) => {
    console.log(user_id, "chat screen opening");
  };
  // console.log(userMessagesList,"chauserMessagesListt screen opening")
  const ShowProfileDetails = () => {
    showProfilePage(true);
  };

  const showNotification = (message) => {
    console.log(message, "================", Notification.permission);
    if (Notification.permission === "granted") {
      const notification = new Notification("New Message", {
        body: message,
        icon: "/path_to_icon.png", // optional
      });

      // Play sound
      const audio = new Audio(assets.notication_soundFile);
      audio.play();
    }
  };

  useEffect(() => {
    // Request permission for notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  return (
    <div className="chat-container">
      <Sidebar
        SetSelectedUSer={SetSelectedUSer}
        SetSelectedGroup={SetSelectedGroup}
      />

      <div className="chat-area">
        {profilePage ? (
          <ProfileDetails
            isGroup={true}
            data="data"
            username={groupOpen}
            members={membersInGroup}
            id={
              selectedGroupId !== null
                ? selectedGroupId
                : selectedUserId !== null
                ? selectedUserId
                : ""
            }
          />
        ) : (
          <>
            <div
              className="status-show"
              style={
                connectionStatus === "Open"
                  ? { background: "green", display: "None" }
                  : connectionStatus === "Connecting"
                  ? { background: "yellow" }
                  : { background: "red" }
              }
            >
              <span>The WebSocket is currently {connectionStatus}</span>
            </div>
            {selectedUserId ? (
              <>
                <div className="chat-header">
                  <PrimarySearchAppBar
                    selectedUserId={selectedUserId}
                    profilePicture="https://via.placeholder.com/40"
                    username={opponentUser}
                    ShowProfileDetails={ShowProfileDetails}
                    onlineStatus={
                      onlineUsers ? onlineUsers.includes(selectedUserId) : false
                    }
                    isOpponentUserTyping={isOpponentUserTyping}
                  />
                </div>
                <div className="messages">
                  <Message
                    userMessagesList={userMessagesList}
                    chat_type="one_to_one"
                  />
                </div>
                <button id="myBtn" title="Go to bottom">
                  <img src={assets.down_icon} />
                </button>
                <MessageInput
                  inputId="inputId"
                  sendJsonMessages={sendUserJsonMessage}
                  chat_user_id={
                    selectedGroupId != null
                      ? selectedGroupId
                      : selectedUserId != null
                      ? selectedUserId
                      : null
                  }
                />
              </>
            ) : selectedGroupId ? (
              <>
                <div className="chat-header">
                  <GroupNavBAr
                    selectedUserId={selectedGroupId}
                    profilePicture="https://via.placeholder.com/40"
                    username={groupOpen}
                    members={membersInGroup}
                    ShowProfileDetails={ShowProfileDetails}
                    userInGroupTyping={userInGroupTyping}
                  />
                </div>
                <div className="messages">
                  <Message
                    userMessagesList={userMessagesList}
                    chat_type="group_chat"
                    // sender_name={item.sender_name}
                    // sender_email={item.sender_email}
                  />
                </div>

                <button id="myBtn" title="Go to bottom">
                  <img src={assets.down_icon} />
                </button>
                <MessageInput
                  inputId="inputId"
                  sendJsonMessages={sendInGroupJsonMessage}
                  typing_user_id={user_id}
                  chat_user_id={
                    selectedGroupId != null
                      ? selectedGroupId
                      : selectedUserId != null
                      ? selectedUserId
                      : null
                  }
                />
              </>
            ) : (
              <ChatDemoScreen />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAuthentication(ChatArea);
