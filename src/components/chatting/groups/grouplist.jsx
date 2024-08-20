import React, { useState, useEffect } from "react";
import axios from "axios";
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  .split("=")[1];

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    axios.get("/api/groups/").then((response) => {
      setGroups(response.data);
    });
  }, []);

  const createGroup = () => {
    axios.post("/api/groups/", { name: groupName }).then((response) => {
      setGroups([...groups, response.data]);
      setGroupName("");
    });
  };

  return (
    <div>
      <h2>Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="New group name"
      />
      <button onClick={createGroup}>Create Group</button>
    </div>
  );
};

export default GroupList;
