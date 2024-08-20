export default function Message({ userMessagesList, item, chat_type }) {
  return (
    <>
      {userMessagesList.length > 0 ? (
        userMessagesList.map((item, index) => (
          <div
            key={index}
            className={`message ${item.sender ? "sent" : "recieved"}`}
          >
            <div className="message-bubble">
              {!item.sender && chat_type === "group_chat" && (
                <>
                  {" "}
                  <u className="user-detail-in-message">
                    <small>
                      <span className="username_in_chat">
                        {item.sender_name}
                      </span>{" "}
                      <span className="user_email_in_chat">
                        ~{item.sender_email}
                      </span>
                    </small>
                  </u>
                  <br />
                </>
              )}
              {item.message}
            </div>
          </div>
        ))
      ) : (
        <div className="status-show ">
          <span> Start chatting now </span>
        </div>
      )}
    </>
  );
}
