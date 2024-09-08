import React, { type FC } from "react";
import { MashImage } from "@/components/elements/MashImage";

type Stat = { name: string; data: string };

interface ProfileWidgetProps {
  image: string;
  name: string;
  role: string;
  stats: [Stat, Stat, Stat];
  type?: "normal" | "skewed" | "inverted";
}

const ProfileWidget: FC<ProfileWidgetProps> = ({
  image,
  name,
  role,
  stats,
  type = "normal",
}) => {
  return (
    <div
      className={`border-muted-é00 w-full overflow-hidden rounded-lg border bg-white dark:border-muted-800 dark:bg-muted-950 ${
        type === "inverted" ? "flex flex-col-reverse" : "flex flex-col"
      }`}
    >
      <div
        className={`flex items-center justify-center py-10 ${
          type === "skewed"
            ? "bg-primary-500"
            : "bg-muted-100 dark:bg-muted-800"
        }`}
      >
        <div className="info-block text-center">
          <MashImage
            className="mx-auto mb-2 max-w-[90px] rounded-full border-[3px] border-white dark:border-muted-950"
            src={image}
            height={90}
            width={90}
            alt="Profile picture"
          />
          <div
            className={`font-sans text-base font-light ${
              type === "skewed"
                ? "text-muted-100"
                : "text-muted-800 dark:text-muted-100"
            }`}
          >
            {name}
          </div>
          <div
            className={`role text-[0.68rem]  ${
              type === "skewed"
                ? "text-muted-100/70"
                : "dark:text-muted-100 text-muted-400"
            }`}
          >
            {role}
          </div>
        </div>
      </div>
      <div
        className={`relative p-6 ${
          type === "skewed"
            ? "before:absolute before:inset-0 before:origin-top-left before:-skew-y-[5deg] before:bg-white before:content-[''] dark:before:bg-muted-950"
            : ""
        }`}
      >
        <div className="relative z-[2] flex items-center justify-between text-center">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <div className="text-[.56rem] uppercase text-muted-400">
                {stat.name}
              </div>
              <div className="text-muted-800 text-xl font-medium dark:text-muted-100">
                {stat.data}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
