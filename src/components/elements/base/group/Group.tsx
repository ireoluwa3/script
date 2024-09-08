import React, { type FC } from "react";

interface GroupProps {
  children?: React.ReactNode;
}

const Group: FC<GroupProps> = ({ children }) => {
  const buttonClasses =
    "[&>button]:!border-e-0 [&>button:not(:first-child):not(:last-child)]:!rounded-none [&>button:first-child]:!rounded-e-none [&>button:last-child]:!rounded-s-none [&>button:last-child]:!border-e";

  const inputClasses =
    "[&>div>div>input]:!border-e-0 [&>div:not(:first-child):not(:last-child)>div>input]:!rounded-none [&>div:first-child>div>input]:!rounded-e-none [&>div:last-child>div>input]:!rounded-s-none [&>div:last-child>div>input]:!border-e";

  const selectClasses =
    "[&>div>div>div>select]:!border-e-0 [&>div:not(:first-child):not(:last-child)>div>div>select]:!rounded-none [&>div:first-child>div>div>select]:!rounded-e-none [&>div:last-child>div>div>select]:!rounded-s-none [&>div:last-child>div>div>select]:!border-e";

  const comboboxClasses =
    "[&>div>div>div>input]:!border-e-0 [&>div:not(:first-child):not(:last-child)>div>div>input]:!rounded-none [&>div:first-child>div>div>input]:!rounded-e-none [&>div:last-child>div>div>input]:!rounded-s-none [&>div:last-child>div>div>input]:!border-e";

  const listboxClasses =
    "[&>div>div>div>button]:!border-e-0 [&>div:not(:first-child):not(:last-child)>div>div>button]:!rounded-none [&>div:first-child>div>div>button]:!rounded-e-none [&>div:last-child>div>div>button]:!rounded-s-none [&>div:last-child>div>div>button]:!border-e";

  return (
    <div
      className={`flex ${buttonClasses} ${inputClasses} ${selectClasses} ${comboboxClasses} ${listboxClasses}`}
    >
      {children}
    </div>
  );
};

export default Group;
