import React, { type FC } from "react";
import { MashImage } from "@/components/elements/MashImage";
import Button from "@/components/elements/base/button/Button";

interface ActionWidgetProps {
  image: string;
  title: string;
  text?: string;
  buttons?: React.ReactNode;
  btnText?: string;
}

const ActionWidget: FC<ActionWidgetProps> = ({
  title,
  text,
  image,
  buttons,
  btnText = "Open Help Center",
}) => {
  return (
    <div className="rounded-lg border border-muted-200 bg-white px-6 py-8 dark:border-muted-800 dark:bg-muted-900">
      <MashImage
        className="w-full max-w-[280px] mx-auto"
        width={210}
        height={150}
        src={image}
        alt="Widget picture"
      />
      <div className="py-4 text-center">
        <h3 className="mb-2 font-sans text-lg font-medium leading-tight text-muted-800 dark:text-muted-100">
          {title}
        </h3>
        <p className="text-center font-sans text-sm text-muted-400">
          {text
            ? text
            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui non
          moveatur et offensione`}
        </p>
      </div>

      {buttons ? (
        buttons
      ) : (
        <Button color="primary" className="w-full">
          {btnText}
        </Button>
      )}
    </div>
  );
};

export default ActionWidget;
