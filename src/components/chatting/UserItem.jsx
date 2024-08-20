import React, { useState } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
// import Image from "@mui/icons-material/Image";
// import ImageIcon from "@mui/icons-material/Image";
import { Link } from "react-router-dom";
// import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import CustomAvatar from "./customeAvatar";
function UserItem({ email, name, id, SetSelectedUSer }) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserClass, setSelectedUserClass] = useState("user-list");

  // const userProfileurl = `/user/${id}`;
  const SettingSelctedUser = (id) => {
    SetSelectedUSer(id);
    setSelectedUserId(id);
    setSelectedUserClass((prev) => prev + " " + "clickedUserAtSidenav");
  };
  return (
    // to={userProfileurl}
    <List sx={{ width: "100%", bgcolor: "#2c3e50", padding: 0 }}>
      <ListItem
        alignItems="flex-start"
        onClick={() => SettingSelctedUser(id)}
        className={`${selectedUserClass}`}
        //className={`user-list  ${
        // selectedUserId === id ? "clickedUserAtSidenav" : ""
        // }`}
      >
        <ListItemAvatar>
          <CustomAvatar username={name} />
        </ListItemAvatar>
        <Link underline="none">
          <ListItemText
            primary={
              <React.Fragment>
                <Typography color="white">{name}</Typography>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body4"
                  color="white"
                >
                  {email}
                </Typography>
                {/* {" — I'll be in your neighborhood doing errands this…"} */}
              </React.Fragment>
            }
          ></ListItemText>
        </Link>
        {/* <FaEllipsisV className="icon-side" /> */}
      </ListItem>
    </List>
  );
}

export default UserItem;
