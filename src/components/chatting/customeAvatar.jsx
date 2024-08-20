import { Avatar } from "@mui/material";

const CustomAvatar = ({ username }) => {
  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (name) => {
    let displayName = name[0].toUpperCase();
    return {
      sx: {
        bgcolor: "#a90c8a", //stringToColor(name),
      },
      children: displayName,
    };
  };
  return (
    <Avatar className="user_or_group-name" {...stringAvatar(username)}>
      {/* {name.toUpperCase()[0]} */}
    </Avatar>
  );
};

export default CustomAvatar;
