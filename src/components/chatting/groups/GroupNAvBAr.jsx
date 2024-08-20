import axios from "axios";
import { FaCamera, FaHeadphones, FaEllipsisV } from "react-icons/fa";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ProfileDetails from "../ProfileDetails";
import "../ProfileRow.css";
import CustomAvatar from "../customeAvatar";
import { colors } from "@mui/material";
const token =
  document.cookie &&
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    .split("=")[1];

const GroupNavBAr = ({
  selectedUserId,
  profilePicture,
  username,
  members,
  ShowProfileDetails,
  onlineStatus,
  userInGroupTyping,
}) => {
  const deleteGroup = async (id) => {
    console.log(`Deleting group with id: ${id}`);
    await axios
      .delete(`http://127.0.0.1:8000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status) {
          alert("Group Deleted");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="profile-row">
      <div className="namebar" onClick={ShowProfileDetails}>
        {/* <img src={profilePicture} alt="Profile" className="profile-picture" /> */}
        <CustomAvatar
          className="user_or_group-name"
          username={(username && username) || "?"}
        />
        <div className="user_or_group-name" style={{ marginLeft: "10px" }}>
          {username}
          {"      "}
          <span className="member_count">
            {" "}
            {members && `${members.length} members`}
            <span style={{ color: "white", fontSize: "11px" }}>
              {userInGroupTyping.is_typing == true
                ? `${userInGroupTyping.userid} is typing....`
                : null}
            </span>
          </span>
        </div>
      </div>
      <div className="icons">
        {members && (
          <DeleteForeverIcon
            onClick={() => {
              deleteGroup(selectedUserId);
            }}
          />
        )}

        <FaCamera className="icon" />
        <FaHeadphones className="icon" />
        <FaEllipsisV className="icon" />
      </div>
    </div>
  );
};

export default GroupNavBAr;
