// components/UserProfileInfo.js

import React from "react";
import { MashImage } from "@/components/elements/MashImage";

const UserProfileInfo = ({ field, data, size = "md" }) => {
  let avatarSize = 64;
  switch (size) {
    case "xs":
      avatarSize = 24;
      break;
    case "sm":
      avatarSize = 32;
      break;
    case "md":
      avatarSize = 64;
      break;
    case "lg":
      avatarSize = 128;
      break;
    default:
      avatarSize = 64;
  }
  return (
    <div className="flex items-center gap-3">
      {field.avatar && (
        <MashImage
          src={data.avatar || "/img/avatars/placeholder.webp"}
          alt="Avatar"
          width={avatarSize}
          height={avatarSize}
          className="rounded-full"
        />
      )}
      <div className="font-sans">
        <span className="block text-sm font-medium text-muted-800 dark:text-muted-100">
          {data.firstName} {data.lastName}
        </span>
        <span className="block text-xs text-muted-400">{data.id}</span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
