import React, { type FC } from "react";
import { type AvatarProps } from "@/components/elements/base/avatar/Avatar";
import Avatar from "@/components/elements/base/avatar/Avatar";

interface AvatarGroupProps {
  avatars: AvatarProps[];
  limit?: number;
  size?: AvatarProps["size"];
}

const AvatarGroup: FC<AvatarGroupProps> = ({
  avatars,
  limit = 4,
  size = "xs",
}) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, limit).map((avatar, index) => (
        <Avatar
          key={index}
          overlaps
          size={size}
          src={avatar.src}
          alt={avatar.alt ?? "avatar image"}
        />
      ))}

      {avatars.length > limit && (
        <Avatar overlaps size={size} text={`+${avatars.length - limit}`} />
      )}
    </div>
  );
};

export default AvatarGroup;
