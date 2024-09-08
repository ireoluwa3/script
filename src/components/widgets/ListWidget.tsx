import React, { type FC } from "react";
import Card from "@/components/elements/base/card/Card";

interface ListWidget extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  color?: "default" | "contrast" | "muted" | "mutedContrast";
  shape?: "straight" | "rounded" | "smooth" | "curved" | "straight";
}

const ListWidget: FC<ListWidget> = ({
  title,
  color = "contrast",
  shape = "smooth",
  children,
}) => {
  const childrenArray = React.Children.toArray(children);
  return (
    <div className="flex w-full">
      <Card color={color} shape={shape} className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <h4 className="font-sans text-base font-medium leading-tight tracking-wider text-muted-800 dark:text-white">
              {title}
            </h4>
          </div>
        </div>
        <ul className="list-none">
          {childrenArray.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ListWidget;
