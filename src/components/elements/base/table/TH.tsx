import { type FC } from "react";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TH: FC<TableHeadProps> = ({
  className: classes = "",
  children,
  ...props
}) => (
  <th
    className={`bg-transparent py-4 px-3 text-start font-sans text-xs font-medium uppercase text-muted-400 tracking-wide ${classes}`}
    {...props}
  >
    {children}
  </th>
);

export default TH;
