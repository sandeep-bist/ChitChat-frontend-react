import React, { useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
const theme = createTheme();
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const token =
  document.cookie &&
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    .split("=")[1];
const GroupCreator = ({ users, group, handleGroups }) => {
  const [open, setOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  const [contacts] = useState(users);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (value) => () => {
    const currentIndex = selectedContacts.indexOf(value);
    const newChecked = [...selectedContacts];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedContacts(newChecked);
  };

  const handleCreateGroup = () => {
    // API call to create the group
    axios
      .post(
        "http://127.0.0.1:8000/api/groups/",

        { name: groupName, members: selectedContacts },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response, "groipp repsonse");
        // setGroups([...groups, response.data]);
        // Reset state
        setGroupName("");
        setSelectedContacts([]);
        handleClose();
      })
      .catch((error) => console.error(error));
    console.log(groups, "Creating group with name:", groupName);
    console.log("Selected contacts:", selectedContacts);
    // handleGroups(groups);
  };
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Group
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="transition-modal-title">Create a New Group</h2>
          <TextField
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="normal"
          />
          <List>
            {contacts.map((contact) => {
              const labelId = `checkbox-list-label-${contact.id}`;

              return (
                <ListItem
                  key={contact.id}
                  role={undefined}
                  dense
                  button
                  onClick={handleToggle(contact.id)}
                >
                  <ListItemText id={labelId} primary={contact.email} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(contact.id)}
                      checked={selectedContacts.indexOf(contact.id) !== -1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGroup}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupCreator;
