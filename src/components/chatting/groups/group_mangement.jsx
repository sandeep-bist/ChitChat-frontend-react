import React, { useState, useEffect } from "react";
import axios from "axios";
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  .split("=")[1];

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/groups/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response, "---------");
        setGroups(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const createGroup = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/groups/",

        { name: groupName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => setGroups([...groups, response.data]))
      .catch((error) => console.error(error));
    setGroupName("");
  };

  return (
    <div>
      <h2>Group Management</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupManagement;
