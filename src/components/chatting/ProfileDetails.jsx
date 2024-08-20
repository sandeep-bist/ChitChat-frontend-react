import React, { useState } from "react";
import CustomAvatar from "./customeAvatar";

const ProfileDetails = ({ isGroup, data, username, members, id }) => {
  // Sample user data
  const [user] = useState({
    name: "John Doe",
    phoneNumber: "+1 234 567 890",
    about: "Available",
    profilePicture: "https://via.placeholder.com/150", // Placeholder image
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };
  console.log(isGroup, "---------------", username);

  return (
    <div>
      {isGroup == true ? (
        <div className="profile_page">
          <CustomAvatar username={username} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfileDetails;
