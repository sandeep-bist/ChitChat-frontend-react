import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import withAuthentication from "../../utils/withAuthentication";
import axios from "axios";
import {
  Avatar,
  Box,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import UserItem from "./UserItem";
import { alignProperty } from "@mui/material/styles/cssUtils";
import { FaAd, FaPlus, FaSave, FaUserMinus, FaWonSign } from "react-icons/fa";
import GroupCreator from "./groups/grou_creator";
import GroupItem from "./groups/GroupItem";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Sidebar({ SetSelectedUSer, SetSelectedGroup }) {
  const BASE_API_URL = "http://127.0.0.1:8000/";
  const [userList, setUserList] = useState([]);
  const [userLoader, setUserLoader] = useState(true);
  const [value, setValue] = React.useState(0);
  const [groups, setGroups] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGroups = (newgroup) => {
    console.log("new group", newgroup);
    setGroups(newgroup);
  };

  const getAUthTokenFromCOokie = () => {
    const cookies = document.cookie.split(";");
    // console.log("cokieeesssse",cookies);

    for (let cookie in cookies) {
      // console.log("cokieeee",cookies[cookie]);
      const [name, value] = cookies[cookie].trim().split("=");
      if (name == "token") {
        // console.log("tokn-----------",value);

        return value;
      }
    }
    return null;
  };

  const getGroupList = async () => {
    const authToken = getAUthTokenFromCOokie();
    if (authToken) {
      await axios
        .get(`${BASE_API_URL}api/groups/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          console.log(response.data, "fetchhhh gorupsssss");
          setGroups(response.data);
          // setUserLoader(false);
        })
        .catch((error) => {
          console.log(error, "error========getting user list=");
        });
    } else {
      console.log("token is null");
    }
  };
  useEffect(() => {
    const authToken = getAUthTokenFromCOokie();
    if (authToken) {
      axios
        .get(`${BASE_API_URL}api/users/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          // console.log(response.data);
          setUserList(response.data);
          setUserLoader(false);
        })
        .catch((error) => {
          console.log(error, "error========getting user list=");
        });
    } else {
      console.log("token is null");
    }
  }, []);

  return (
    <div className="sidebar">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="white"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab label="Chats" {...a11yProps(0)} />
            <Tab label="Groups" {...a11yProps(1)} onClick={getGroupList} />
            <Tab label="Status" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {userLoader ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ) : (
            <List sx={{ width: "100%", bgcolor: "#2c3e50" }}>
              {userList.map((user, index) => (
                <UserItem
                  key={index}
                  email={user.email}
                  name={`${user.first_name} ${user.last_name}`}
                  id={user.id}
                  SetSelectedUSer={SetSelectedUSer}
                />
              ))}
            </List>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="">
            <GroupCreator
              users={userList}
              group={groups}
              handleGroups={handleGroups}
            />
            {groups.length === 0 ? (
              <div className=""> Groups List empty</div>
            ) : (
              <List sx={{ width: "100%", bgcolor: "#2c3e50" }}>
                {groups.map((group, index) => (
                  <GroupItem
                    key={index}
                    name={group.name}
                    id={group.id}
                    SetSelectedGroup={SetSelectedGroup}
                  />
                ))}
              </List>
            )}
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          No status
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default withAuthentication(Sidebar);
